/**
 * Phase 8.6A — Controlled Real Document Pre-Model PII Redaction Plan.
 *
 * PLANNING-ONLY — NO RUNTIME BEHAVIOR — DEPENDS ON 8.5W.
 *
 * This phase defines future requirements for a pre-model PII redaction
 * boundary. It does NOT implement PII redaction, does NOT redact real text,
 * does NOT process raw PII, and does NOT authorize real document input,
 * user-visible output, prompt build, model call, or runSmartTalk.
 *
 * This file does NOT:
 *   - Modify any route file.
 *   - Call OpenAI, fetch, runSmartTalk, or read process.env.
 *   - Use SDKs, Stripe, checkout, or entitlement runtime.
 *   - Import live route, payment, Stripe, checkout, or entitlement modules.
 *   - Implement PII redaction, detection, or masking runtime.
 *   - Redact real text or process raw PII.
 *   - Persist raw PII or write storage/database/audit persistence.
 *   - Grant runtime, pilot, production, or final go-live authorization.
 *   - Perform any I/O or side effects.
 */

import { runControlledRealDocumentPaidDocumentModeBoundaryClosureDecision } from "./run-controlled-real-document-paid-document-mode-boundary-closure-decision";

// ── Input type ────────────────────────────────────────────────────────────────

interface ControlledRealDocumentPreModelPiiRedactionPlanInput {
  // 8.5W prerequisite gate — core
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly paidDocumentModeBoundaryPostPatchAuditReadyForClosureDecision: boolean;
  readonly controlledRealDocumentPaidDocumentModeBoundaryClosureDecisionAccepted: boolean;
  readonly paidDocumentModeBoundaryClosureDecisionOnly: boolean;
  readonly paidDocumentModeBoundaryContainmentClosed: boolean;
  readonly paidDocumentModeBoundaryClientFlagBypassClosed: boolean;
  readonly paidDocumentModeBoundaryDenyByDefaultClosed: boolean;
  readonly paidDocumentModeBoundaryServerEntitlementRequirementPreserved: boolean;
  readonly paidDocumentModeBoundaryActualRuntimeStillDeferred: boolean;
  readonly paidDocumentModeRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeCheckoutRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeServerEntitlementVerificationStillNotImplemented: boolean;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: boolean;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: boolean;
  readonly prereqTamperCasesRejected: boolean;

  // 8.5W closure decision fields
  readonly closureDecisionTd005ContainmentClosed: boolean;
  readonly closureDecisionTd005ClientFlagBypassClosed: boolean;
  readonly closureDecisionTd005BoundaryPatchAccepted: boolean;
  readonly closureDecisionTd005PostPatchAuditAccepted: boolean;
  readonly closureDecisionTd005RuntimeImplementationDeferred: boolean;
  readonly closureDecisionDoesNotAuthorizePaidDocumentModeRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizePaymentRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizeCheckoutRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizeEntitlementRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizeServerEntitlementVerification: boolean;
  readonly closureDecisionDoesNotAuthorizeDocumentProcessing: boolean;
  readonly closureDecisionDoesNotAuthorizeOcrRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizeFileRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizeStorage: boolean;
  readonly closureDecisionDoesNotAuthorizePersistence: boolean;
  readonly closureDecisionDoesNotAuthorizeUserVisibleDocumentOutput: boolean;
  readonly closureDecisionDoesNotAuthorizePublicRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizePilotRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizeProductionRuntime: boolean;
  readonly closureDecisionRequiresFutureActualRuntimeImplementation: boolean;
  readonly closureDecisionRequiresFuturePreModelPiiRedaction: boolean;
  readonly closureDecisionRequiresFutureEvidenceGatesProductionWiring: boolean;
  readonly closureDecisionRequiresFutureServerEntitlementVerification: boolean;
  readonly closureDecisionRequiresFutureUserVisibleOutputContract: boolean;
  readonly closureDecisionRequiresFuturePilotAuthorization: boolean;

  // 8.5W containment closure confirmations
  readonly containmentClosure8x5UDenyBoundaryAccepted: boolean;
  readonly containmentClosure8x5VAuditAccepted: boolean;
  readonly containmentClosureSmartTalkRouteDenyBoundaryConfirmed: boolean;
  readonly containmentClosureBoundaryBeforeRunSmartTalkConfirmed: boolean;
  readonly containmentClosureBoundaryAfterJsonParseConfirmed: boolean;
  readonly containmentClosureBoundaryAfterTextValidationConfirmed: boolean;
  readonly containmentClosureFreeQaLanePreserved: boolean;
  readonly containmentClosureGeneralQuestionsPreserved: boolean;
  readonly containmentClosure8x5NDocumentBypassGuardPreserved: boolean;
  readonly containmentClosureDocumentLikeTextBlockingPreserved: boolean;
  readonly containmentClosure8x5HPhotoOcrQuarantinePreserved: boolean;
  readonly containmentClosurePhotoRouteUnmodified: boolean;
  readonly containmentClosureNoPhotoRuntimeEnabled: boolean;
  readonly containmentClosureNoOcrRuntimeEnabled: boolean;
  readonly containmentClosureNoFileRuntimeEnabled: boolean;
  readonly containmentClosureNoStorageEnabled: boolean;
  readonly containmentClosureNoPersistenceEnabled: boolean;
  readonly containmentClosureNoPublicDocumentRuntimeEnabled: boolean;
  readonly containmentClosureClientFlagsRemainUntrusted: boolean;
  readonly containmentClosureNoEntitledLaneCreated: boolean;
  readonly containmentClosureNoPaymentLaneCreated: boolean;
  readonly containmentClosureNoDocumentProcessingLaneCreated: boolean;
  readonly containmentClosureNoUserVisibleDocumentLaneCreated: boolean;

  // 8.5W actual mutation/runtime flags (shared with 8.6A result assertions)
  readonly actualClosureDecisionOnly: boolean;
  readonly actualLiveRouteMutationPerformedInThisPhase: boolean;
  readonly actualSmartTalkRouteModifiedInThisPhase: boolean;
  readonly actualPhotoRouteModifiedInThisPhase: boolean;
  readonly actualPaidDocumentBoundaryAlreadyImplementedBy8x5U: boolean;
  readonly actualPaidDocumentBoundaryImplementedInThisPhase: boolean;
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
  readonly actualPiiRedactionImplemented: boolean;
  readonly actualEvidenceGateRuntimeWiringPerformed: boolean;
  readonly actualClaimAuthorizationPerformed: boolean;
  readonly actualDeadlineCalculationPerformed: boolean;
  readonly actualPromptBuildPerformed: boolean;
  readonly actualModelCallPerformed: boolean;
  readonly actualRunSmartTalkCalled: boolean;

  // 8.5W no-prohibited-side-effect confirmations
  readonly closureDecisionConfirmsNoOpenAiCall: boolean;
  readonly closureDecisionConfirmsNoFetchCall: boolean;
  readonly closureDecisionConfirmsNoProcessEnvRead: boolean;
  readonly closureDecisionConfirmsNoSdkUsage: boolean;
  readonly closureDecisionConfirmsNo8x3AcRerun: boolean;
  readonly closureDecisionConfirmsNoPaymentRuntimeCall: boolean;
  readonly closureDecisionConfirmsNoStripeCall: boolean;
  readonly closureDecisionConfirmsNoCheckoutCall: boolean;
  readonly closureDecisionConfirmsNoEntitlementRuntimeCall: boolean;
  readonly closureDecisionConfirmsNoServerEntitlementVerification: boolean;
  readonly closureDecisionConfirmsNoOcrRuntimeCall: boolean;
  readonly closureDecisionConfirmsNoStorageMutation: boolean;
  readonly closureDecisionConfirmsNoDatabaseWrite: boolean;
  readonly closureDecisionConfirmsNoAuditPersistence: boolean;
  readonly closureDecisionConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly closureDecisionConfirmsNoEvidenceEvaluation: boolean;
  readonly closureDecisionConfirmsNoClaimAuthorization: boolean;
  readonly closureDecisionConfirmsNoDeadlineCalculation: boolean;
  readonly closureDecisionConfirmsNoLegalCertainty: boolean;
  readonly closureDecisionConfirmsNoPromptBuild: boolean;
  readonly closureDecisionConfirmsNoModelCall: boolean;
  readonly closureDecisionConfirmsNoRunSmartTalkCall: boolean;
  readonly closureDecisionConfirmsNoRouteHandlerCall: boolean;
  readonly closureDecisionConfirmsNoRouteImport: boolean;
  readonly closureDecisionConfirmsNoFilesystemRead: boolean;
  readonly closureDecisionConfirmsNoPhotoRouteModification: boolean;

  // Pipeline executed flags from 8.5W (all false)
  readonly executionSequenceActuallyExecuted: boolean;
  readonly runtimePipelineActuallyExecuted: boolean;
  readonly documentPipelineActuallyExecuted: boolean;
  readonly paymentPipelineActuallyExecuted: boolean;
  readonly entitlementPipelineActuallyExecuted: boolean;
  readonly checkoutPipelineActuallyExecuted: boolean;
  readonly ocrPipelineActuallyExecuted: boolean;
  readonly userVisiblePipelineActuallyExecuted: boolean;

  // Runtime authorization flags from 8.5W (all false)
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

  // Authorization grants from 8.5W (all false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;
  readonly goLiveAuthorizationGranted: boolean;

  // Legal safety flags from 8.5W
  readonly exactDeadlineCalculationAuthorized: boolean;
  readonly deliveryDateInventionAuthorized: boolean;
  readonly finalDateInventionAuthorized: boolean;
  readonly legalCertaintyAuthorized: boolean;
  readonly coerciveLegalInstructionAuthorized: boolean;
  readonly deliveryDateRequiredForExactDeadline: boolean;

  // TD flags from 8.5W result
  readonly td001DocumentBypassGuardContainmentClosed: boolean;
  readonly td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed: boolean;
  readonly td005PaidDocumentModeBoundaryPostPatchContainmentAudited: boolean;
  readonly td005PaidDocumentModeBoundaryContainmentClosed: boolean;
  readonly td005PaidDocumentModeClientFlagBypassClosed: boolean;
  readonly td005PaidDocumentModeActualRuntimeImplementationDeferred: boolean;
  readonly td005PaidDocumentModeStillRequiresActualRuntimeImplementation: boolean;
  readonly td004PreModelPiiRedactionMissing: boolean;
  readonly td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: boolean;
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: boolean;
  readonly td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: boolean;
  readonly td006EvidenceGateTodoAndOrSemanticsUnresolved: boolean;
  readonly td007TrapClaimDispositionNamespaceHardeningUnresolved: boolean;
  readonly td008InMemoryRateLimiterServerlessUnsafe: boolean;
  readonly td010GetUserStateDocumentTypeTodoOpen: boolean;
  readonly td009TmpDebugRunnerDebtClosed: boolean;
  readonly tmpFilesPresentInWorkingTree: boolean;

  // 8.5W forward readiness gate
  readonly readyForPreModelPiiRedactionPhase: boolean;
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

  // 8.6A core assertion flags
  readonly paidDocumentModeBoundaryClosureReadyForPiiRedactionPlanning: boolean;
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

  // Planning confirmations
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

  // PII class coverage
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

  // Redaction/masking requirements
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

  // Placeholder plan confirmations
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

  // Safety confirmations
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

  // Failure mode confirmations
  readonly piiPlanDefinesFailurePiiRedactionRequired: boolean;
  readonly piiPlanDefinesFailurePiiRedactionIncomplete: boolean;
  readonly piiPlanDefinesFailurePiiRedactionConfidenceLow: boolean;
  readonly piiPlanDefinesFailurePiiRedactionUnsafeForModel: boolean;
  readonly piiPlanDefinesFailureBlockedHighRiskIdentifier: boolean;
  readonly piiPlanDefinesFailureBlockedMedicalIdentifier: boolean;
  readonly piiPlanDefinesFailureBlockedImmigrationIdentifier: boolean;
  readonly piiPlanDefinesFailureBlockedFinancialIdentifier: boolean;
  readonly piiPlanDefinesFailureBlockedUnknownDocumentIdentity: boolean;

  // Downstream confirmations
  readonly piiPlanRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly: boolean;
  readonly piiPlanRequiresClaimAuthorizationUseRedactedAnchorsOnly: boolean;
  readonly piiPlanRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized: boolean;
  readonly piiPlanRequiresAuditTracesUsePlaceholderCategoriesOnly: boolean;
  readonly piiPlanRequiresDeadlineLogicStillRequireDeliveryDateEvidence: boolean;
  readonly piiPlanRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized: boolean;
  readonly piiPlanRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts: boolean;

  // 8.6A new actual flags (no conflict with 8.5W prereq names)
  readonly actualPiiRedactionPlanOnly: boolean;
  readonly actualPiiDetectorRuntimeImplemented: boolean;
  readonly actualPiiMaskingRuntimeImplemented: boolean;
  readonly actualPiiTextRedacted: boolean;
  readonly actualRawPiiProcessed: boolean;
  readonly actualRawPiiPersisted: boolean;
  readonly actualRawPiiLogged: boolean;

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

  // 8.6A pipeline executed flags (adds piiPipeline)
  readonly piiPipelineActuallyExecuted: boolean;

  // 8.6A runtime authorization flags (adds preModelPiiRedaction)
  readonly preModelPiiRedactionRuntimeAuthorizedNow: boolean;

  // 8.6A TD result flags
  readonly td004PreModelPiiRedactionPlanned: boolean;
  readonly td004PreModelPiiRedactionStillRequiresContract: boolean;
  readonly td004PreModelPiiRedactionStillRequiresRuntimeImplementation: boolean;
  readonly td004PreModelPiiRedactionStillMissingInProduction: boolean;

  // 8.6A forward readiness
  readonly readyFor8x6BPreModelPiiRedactionContract: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentPreModelPiiRedactionPlanResult {
  readonly checkId: "8.6A";
  readonly allPassed: boolean;
  readonly paidDocumentModeBoundaryClosureReadyForPiiRedactionPlanning: true;
  readonly controlledRealDocumentPreModelPiiRedactionPlanAccepted: boolean;
  readonly preModelPiiRedactionPlanningOnly: true;
  readonly preModelPiiRedactionPlanDefined: true;
  readonly preModelPiiRedactionRuntimeStillNotImplemented: true;
  readonly preModelPiiDetectorRuntimeStillNotImplemented: true;
  readonly preModelPiiMaskingRuntimeStillNotImplemented: true;
  readonly preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: true;
  readonly preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: true;
  readonly preModelPiiRedactionDoesNotAuthorizePromptBuild: true;
  readonly preModelPiiRedactionDoesNotAuthorizeModelCall: true;
  readonly preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: true;
  readonly tamperCasesRejected: boolean;

  // Planning confirmations
  readonly piiPlanRequiresBoundaryBeforePromptBuild: true;
  readonly piiPlanRequiresBoundaryBeforeModelCall: true;
  readonly piiPlanRequiresBoundaryBeforeRunSmartTalkDocumentLane: true;
  readonly piiPlanRequiresBoundaryAfterControlledInputValidation: true;
  readonly piiPlanRequiresBoundaryBeforeEvidenceGateEvaluation: true;
  readonly piiPlanDoesNotCreateFreeQaDocumentBypass: true;
  readonly piiPlanDoesNotAuthorizeRealDocumentInput: true;
  readonly piiPlanDoesNotAuthorizeUserVisibleDocumentOutput: true;
  readonly piiPlanDoesNotAuthorizeExactDeadlineCalculation: true;
  readonly piiPlanDoesNotAuthorizePublicRuntime: true;

  // PII class coverage
  readonly piiPlanCoversPersonNames: true;
  readonly piiPlanCoversPostalAddresses: true;
  readonly piiPlanCoversPhoneNumbers: true;
  readonly piiPlanCoversEmailAddresses: true;
  readonly piiPlanCoversDatesOfBirth: true;
  readonly piiPlanCoversCustomerNumbers: true;
  readonly piiPlanCoversInsuranceNumbers: true;
  readonly piiPlanCoversHealthInsuranceIdentifiers: true;
  readonly piiPlanCoversTaxIds: true;
  readonly piiPlanCoversSteuerId: true;
  readonly piiPlanCoversSteuernummer: true;
  readonly piiPlanCoversAktenzeichen: true;
  readonly piiPlanCoversVorgangsnummer: true;
  readonly piiPlanCoversCaseReferenceNumbers: true;
  readonly piiPlanCoversIban: true;
  readonly piiPlanCoversBankAccountIdentifiers: true;
  readonly piiPlanCoversLicensePlateNumbers: true;
  readonly piiPlanCoversEmployerNamesInPersonalContext: true;
  readonly piiPlanCoversSignatures: true;
  readonly piiPlanCoversHandwrittenNames: true;
  readonly piiPlanCoversGreetingsContainingPersonalNames: true;
  readonly piiPlanCoversDocumentRecipientBlocks: true;
  readonly piiPlanCoversSenderBlocks: true;
  readonly piiPlanCoversRealContactDetails: true;
  readonly piiPlanCoversRealAuthorityContactBlocksCopiedFromDocuments: true;
  readonly piiPlanCoversMedicalHealthContextIdentifiers: true;
  readonly piiPlanCoversImmigrationResidencePermitIdentifiers: true;
  readonly piiPlanCoversSocialBenefitIdentifiers: true;
  readonly piiPlanCoversJobcenterBuergergeldIdentifiers: true;
  readonly piiPlanCoversFamilienkasseKindergeldIdentifiers: true;
  readonly piiPlanCoversAuslaenderbehoerdeIdentifiers: true;
  readonly piiPlanCoversFinanzamtIdentifiers: true;

  // Redaction/masking requirements
  readonly piiPlanRequiresDeterministicPlaceholders: true;
  readonly piiPlanRequiresStablePlaceholderMappingInsideOneRequest: true;
  readonly piiPlanRequiresNoRawPiiPersistenceByDefault: true;
  readonly piiPlanRequiresNoRawPiiInPrompt: true;
  readonly piiPlanRequiresNoRawPiiInLogs: true;
  readonly piiPlanRequiresNoRawPiiInAuditTraces: true;
  readonly piiPlanRequiresNoRawPiiInUserVisibleErrorMessages: true;
  readonly piiPlanRequiresNoRawPiiInTelemetry: true;
  readonly piiPlanRequiresNoRawPiiInModelMetadata: true;
  readonly piiPlanRequiresNoRawPiiInEvidenceGateTraces: true;
  readonly piiPlanRequiresNoRawPiiInDeadlineTraces: true;
  readonly piiPlanRequiresRawToPlaceholderMapLocalEphemeralByDefault: true;
  readonly piiPlanRequiresStructuredRedactionAuditWithoutRawValues: true;
  readonly piiPlanRequiresCoverageMetricsWithoutRawValues: true;
  readonly piiPlanRequiresConservativeFallbackWhenConfidenceUncertain: true;
  readonly piiPlanRequiresBlockOrEscalateIfUnsafeToRedact: true;

  // Placeholder plan confirmations
  readonly piiPlanAllowsPersonPlaceholder: true;
  readonly piiPlanAllowsAddressPlaceholder: true;
  readonly piiPlanAllowsPhonePlaceholder: true;
  readonly piiPlanAllowsEmailPlaceholder: true;
  readonly piiPlanAllowsDobPlaceholder: true;
  readonly piiPlanAllowsCustomerIdPlaceholder: true;
  readonly piiPlanAllowsInsuranceIdPlaceholder: true;
  readonly piiPlanAllowsTaxIdPlaceholder: true;
  readonly piiPlanAllowsCaseRefPlaceholder: true;
  readonly piiPlanAllowsIbanPlaceholder: true;
  readonly piiPlanAllowsAuthorityPlaceholder: true;
  readonly piiPlanAllowsEmployerPlaceholder: true;
  readonly piiPlanAllowsSignaturePlaceholder: true;
  readonly piiPlanAllowsDocumentRecipientPlaceholder: true;
  readonly piiPlanAllowsDocumentSenderPlaceholder: true;

  // Safety confirmations
  readonly piiPlanPreservesLegalSemanticStructureWherePossible: true;
  readonly piiPlanMustNotInventMissingFacts: true;
  readonly piiPlanMustNotAlterDatesIntoFalseDeadlines: true;
  readonly piiPlanMarksProtectedIdentifiersInsteadOfSilentDeletion: true;
  readonly piiPlanMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity: true;
  readonly piiPlanMustNotInferRecipientIdentityFromPartialText: true;
  readonly piiPlanMustNotInferSenderIdentityFromPartialText: true;
  readonly piiPlanMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone: true;
  readonly piiPlanRedactionSuccessDoesNotAuthorizeFinalLegalAdvice: true;
  readonly piiPlanRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation: true;
  readonly piiPlanRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer: true;
  readonly piiPlanRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation: true;

  // Failure mode confirmations
  readonly piiPlanDefinesFailurePiiRedactionRequired: true;
  readonly piiPlanDefinesFailurePiiRedactionIncomplete: true;
  readonly piiPlanDefinesFailurePiiRedactionConfidenceLow: true;
  readonly piiPlanDefinesFailurePiiRedactionUnsafeForModel: true;
  readonly piiPlanDefinesFailureBlockedHighRiskIdentifier: true;
  readonly piiPlanDefinesFailureBlockedMedicalIdentifier: true;
  readonly piiPlanDefinesFailureBlockedImmigrationIdentifier: true;
  readonly piiPlanDefinesFailureBlockedFinancialIdentifier: true;
  readonly piiPlanDefinesFailureBlockedUnknownDocumentIdentity: true;

  // Downstream confirmations
  readonly piiPlanRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly: true;
  readonly piiPlanRequiresClaimAuthorizationUseRedactedAnchorsOnly: true;
  readonly piiPlanRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized: true;
  readonly piiPlanRequiresAuditTracesUsePlaceholderCategoriesOnly: true;
  readonly piiPlanRequiresDeadlineLogicStillRequireDeliveryDateEvidence: true;
  readonly piiPlanRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized: true;
  readonly piiPlanRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts: true;

  // Actual mutation/runtime flags
  readonly actualPiiRedactionPlanOnly: true;
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
  readonly piiPlanConfirmsNoOpenAiCall: true;
  readonly piiPlanConfirmsNoFetchCall: true;
  readonly piiPlanConfirmsNoProcessEnvRead: true;
  readonly piiPlanConfirmsNoSdkUsage: true;
  readonly piiPlanConfirmsNo8x3AcRerun: true;
  readonly piiPlanConfirmsNoPaymentRuntimeCall: true;
  readonly piiPlanConfirmsNoStripeCall: true;
  readonly piiPlanConfirmsNoCheckoutCall: true;
  readonly piiPlanConfirmsNoEntitlementRuntimeCall: true;
  readonly piiPlanConfirmsNoServerEntitlementVerification: true;
  readonly piiPlanConfirmsNoOcrRuntimeCall: true;
  readonly piiPlanConfirmsNoStorageMutation: true;
  readonly piiPlanConfirmsNoDatabaseWrite: true;
  readonly piiPlanConfirmsNoAuditPersistence: true;
  readonly piiPlanConfirmsNoUserVisibleDocumentExplanation: true;
  readonly piiPlanConfirmsNoEvidenceEvaluation: true;
  readonly piiPlanConfirmsNoClaimAuthorization: true;
  readonly piiPlanConfirmsNoDeadlineCalculation: true;
  readonly piiPlanConfirmsNoLegalCertainty: true;
  readonly piiPlanConfirmsNoPromptBuild: true;
  readonly piiPlanConfirmsNoModelCall: true;
  readonly piiPlanConfirmsNoRunSmartTalkCall: true;
  readonly piiPlanConfirmsNoRouteHandlerCall: true;
  readonly piiPlanConfirmsNoRouteImport: true;
  readonly piiPlanConfirmsNoFilesystemRead: true;
  readonly piiPlanConfirmsNoPhotoRouteModification: true;

  // Pipeline executed flags (9, includes piiPipeline)
  readonly executionSequenceActuallyExecuted: false;
  readonly runtimePipelineActuallyExecuted: false;
  readonly documentPipelineActuallyExecuted: false;
  readonly piiPipelineActuallyExecuted: false;
  readonly paymentPipelineActuallyExecuted: false;
  readonly entitlementPipelineActuallyExecuted: false;
  readonly checkoutPipelineActuallyExecuted: false;
  readonly ocrPipelineActuallyExecuted: false;
  readonly userVisiblePipelineActuallyExecuted: false;

  // Runtime authorization flags (19, includes preModelPiiRedaction)
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
  readonly td004PreModelPiiRedactionStillRequiresContract: true;
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
  readonly readyFor8x6BPreModelPiiRedactionContract: true;
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

function validatePiiRedactionPlanInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5W prerequisite gate — core
  if (o["prereqCheckId"] !== "8.5W") reasons.push("prereq_check_id_must_be_8x5W");
  if (o["prereqAllPassed"] !== true) reasons.push("prereq_all_passed_false");
  if (o["paidDocumentModeBoundaryPostPatchAuditReadyForClosureDecision"] !== true)
    reasons.push("prereq_post_patch_audit_ready_for_closure_decision_false");
  if (o["controlledRealDocumentPaidDocumentModeBoundaryClosureDecisionAccepted"] !== true)
    reasons.push("prereq_closure_decision_not_accepted");
  if (o["paidDocumentModeBoundaryClosureDecisionOnly"] !== true)
    reasons.push("prereq_closure_decision_only_false");
  if (o["paidDocumentModeBoundaryContainmentClosed"] !== true)
    reasons.push("prereq_boundary_containment_closed_false");
  if (o["paidDocumentModeBoundaryClientFlagBypassClosed"] !== true)
    reasons.push("prereq_boundary_client_flag_bypass_closed_false");
  if (o["paidDocumentModeBoundaryDenyByDefaultClosed"] !== true)
    reasons.push("prereq_boundary_deny_by_default_closed_false");
  if (o["paidDocumentModeBoundaryServerEntitlementRequirementPreserved"] !== true)
    reasons.push("prereq_boundary_server_entitlement_requirement_preserved_false");
  if (o["paidDocumentModeBoundaryActualRuntimeStillDeferred"] !== true)
    reasons.push("prereq_boundary_actual_runtime_still_deferred_false");
  if (o["paidDocumentModeRuntimeStillNotImplemented"] !== true)
    reasons.push("prereq_paid_document_mode_runtime_still_not_implemented_false");
  if (o["paidDocumentModePaymentRuntimeStillNotImplemented"] !== true)
    reasons.push("prereq_payment_runtime_still_not_implemented_false");
  if (o["paidDocumentModeCheckoutRuntimeStillNotImplemented"] !== true)
    reasons.push("prereq_checkout_runtime_still_not_implemented_false");
  if (o["paidDocumentModeEntitlementRuntimeStillNotImplemented"] !== true)
    reasons.push("prereq_entitlement_runtime_still_not_implemented_false");
  if (o["paidDocumentModeServerEntitlementVerificationStillNotImplemented"] !== true)
    reasons.push("prereq_server_entitlement_verification_still_not_implemented_false");
  if (o["paidDocumentModeDocumentProcessingStillNotAuthorized"] !== true)
    reasons.push("prereq_document_processing_still_not_authorized_false");
  if (o["paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized"] !== true)
    reasons.push("prereq_user_visible_document_explanation_still_not_authorized_false");
  if (o["prereqTamperCasesRejected"] !== true)
    reasons.push("prereq_tamper_cases_rejected_false");

  // 8.5W closure decision fields
  if (o["closureDecisionTd005ContainmentClosed"] !== true)
    reasons.push("prereq_closure_decision_td005_containment_closed_false");
  if (o["closureDecisionTd005ClientFlagBypassClosed"] !== true)
    reasons.push("prereq_closure_decision_td005_client_flag_bypass_closed_false");
  if (o["closureDecisionTd005BoundaryPatchAccepted"] !== true)
    reasons.push("prereq_closure_decision_td005_boundary_patch_accepted_false");
  if (o["closureDecisionTd005PostPatchAuditAccepted"] !== true)
    reasons.push("prereq_closure_decision_td005_post_patch_audit_accepted_false");
  if (o["closureDecisionTd005RuntimeImplementationDeferred"] !== true)
    reasons.push("prereq_closure_decision_td005_runtime_implementation_deferred_false");
  if (o["closureDecisionDoesNotAuthorizePaidDocumentModeRuntime"] !== true)
    reasons.push("prereq_closure_decision_does_not_authorize_paid_document_mode_runtime_false");
  if (o["closureDecisionDoesNotAuthorizePaymentRuntime"] !== true)
    reasons.push("prereq_closure_decision_does_not_authorize_payment_runtime_false");
  if (o["closureDecisionDoesNotAuthorizeCheckoutRuntime"] !== true)
    reasons.push("prereq_closure_decision_does_not_authorize_checkout_runtime_false");
  if (o["closureDecisionDoesNotAuthorizeEntitlementRuntime"] !== true)
    reasons.push("prereq_closure_decision_does_not_authorize_entitlement_runtime_false");
  if (o["closureDecisionDoesNotAuthorizeServerEntitlementVerification"] !== true)
    reasons.push("prereq_closure_decision_does_not_authorize_server_entitlement_verification_false");
  if (o["closureDecisionDoesNotAuthorizeDocumentProcessing"] !== true)
    reasons.push("prereq_closure_decision_does_not_authorize_document_processing_false");
  if (o["closureDecisionDoesNotAuthorizeOcrRuntime"] !== true)
    reasons.push("prereq_closure_decision_does_not_authorize_ocr_runtime_false");
  if (o["closureDecisionDoesNotAuthorizeFileRuntime"] !== true)
    reasons.push("prereq_closure_decision_does_not_authorize_file_runtime_false");
  if (o["closureDecisionDoesNotAuthorizeStorage"] !== true)
    reasons.push("prereq_closure_decision_does_not_authorize_storage_false");
  if (o["closureDecisionDoesNotAuthorizePersistence"] !== true)
    reasons.push("prereq_closure_decision_does_not_authorize_persistence_false");
  if (o["closureDecisionDoesNotAuthorizeUserVisibleDocumentOutput"] !== true)
    reasons.push("prereq_closure_decision_does_not_authorize_user_visible_document_output_false");
  if (o["closureDecisionDoesNotAuthorizePublicRuntime"] !== true)
    reasons.push("prereq_closure_decision_does_not_authorize_public_runtime_false");
  if (o["closureDecisionDoesNotAuthorizePilotRuntime"] !== true)
    reasons.push("prereq_closure_decision_does_not_authorize_pilot_runtime_false");
  if (o["closureDecisionDoesNotAuthorizeProductionRuntime"] !== true)
    reasons.push("prereq_closure_decision_does_not_authorize_production_runtime_false");
  if (o["closureDecisionRequiresFutureActualRuntimeImplementation"] !== true)
    reasons.push("prereq_closure_decision_requires_future_actual_runtime_implementation_false");
  if (o["closureDecisionRequiresFuturePreModelPiiRedaction"] !== true)
    reasons.push("prereq_closure_decision_requires_future_pre_model_pii_redaction_false");
  if (o["closureDecisionRequiresFutureEvidenceGatesProductionWiring"] !== true)
    reasons.push("prereq_closure_decision_requires_future_evidence_gates_production_wiring_false");
  if (o["closureDecisionRequiresFutureServerEntitlementVerification"] !== true)
    reasons.push("prereq_closure_decision_requires_future_server_entitlement_verification_false");
  if (o["closureDecisionRequiresFutureUserVisibleOutputContract"] !== true)
    reasons.push("prereq_closure_decision_requires_future_user_visible_output_contract_false");
  if (o["closureDecisionRequiresFuturePilotAuthorization"] !== true)
    reasons.push("prereq_closure_decision_requires_future_pilot_authorization_false");

  // 8.5W containment closure confirmations
  if (o["containmentClosure8x5UDenyBoundaryAccepted"] !== true)
    reasons.push("prereq_containment_closure_8x5u_deny_boundary_accepted_false");
  if (o["containmentClosure8x5VAuditAccepted"] !== true)
    reasons.push("prereq_containment_closure_8x5v_audit_accepted_false");
  if (o["containmentClosureSmartTalkRouteDenyBoundaryConfirmed"] !== true)
    reasons.push("prereq_containment_closure_smart_talk_route_deny_boundary_confirmed_false");
  if (o["containmentClosureBoundaryBeforeRunSmartTalkConfirmed"] !== true)
    reasons.push("prereq_containment_closure_boundary_before_run_smart_talk_confirmed_false");
  if (o["containmentClosureBoundaryAfterJsonParseConfirmed"] !== true)
    reasons.push("prereq_containment_closure_boundary_after_json_parse_confirmed_false");
  if (o["containmentClosureBoundaryAfterTextValidationConfirmed"] !== true)
    reasons.push("prereq_containment_closure_boundary_after_text_validation_confirmed_false");
  if (o["containmentClosureFreeQaLanePreserved"] !== true)
    reasons.push("prereq_containment_closure_free_qa_lane_preserved_false");
  if (o["containmentClosureGeneralQuestionsPreserved"] !== true)
    reasons.push("prereq_containment_closure_general_questions_preserved_false");
  if (o["containmentClosure8x5NDocumentBypassGuardPreserved"] !== true)
    reasons.push("prereq_containment_closure_8x5n_document_bypass_guard_preserved_false");
  if (o["containmentClosureDocumentLikeTextBlockingPreserved"] !== true)
    reasons.push("prereq_containment_closure_document_like_text_blocking_preserved_false");
  if (o["containmentClosure8x5HPhotoOcrQuarantinePreserved"] !== true)
    reasons.push("prereq_containment_closure_8x5h_photo_ocr_quarantine_preserved_false");
  if (o["containmentClosurePhotoRouteUnmodified"] !== true)
    reasons.push("prereq_containment_closure_photo_route_unmodified_false");
  if (o["containmentClosureNoPhotoRuntimeEnabled"] !== true)
    reasons.push("prereq_containment_closure_no_photo_runtime_enabled_false");
  if (o["containmentClosureNoOcrRuntimeEnabled"] !== true)
    reasons.push("prereq_containment_closure_no_ocr_runtime_enabled_false");
  if (o["containmentClosureNoFileRuntimeEnabled"] !== true)
    reasons.push("prereq_containment_closure_no_file_runtime_enabled_false");
  if (o["containmentClosureNoStorageEnabled"] !== true)
    reasons.push("prereq_containment_closure_no_storage_enabled_false");
  if (o["containmentClosureNoPersistenceEnabled"] !== true)
    reasons.push("prereq_containment_closure_no_persistence_enabled_false");
  if (o["containmentClosureNoPublicDocumentRuntimeEnabled"] !== true)
    reasons.push("prereq_containment_closure_no_public_document_runtime_enabled_false");
  if (o["containmentClosureClientFlagsRemainUntrusted"] !== true)
    reasons.push("prereq_containment_closure_client_flags_remain_untrusted_false");
  if (o["containmentClosureNoEntitledLaneCreated"] !== true)
    reasons.push("prereq_containment_closure_no_entitled_lane_created_false");
  if (o["containmentClosureNoPaymentLaneCreated"] !== true)
    reasons.push("prereq_containment_closure_no_payment_lane_created_false");
  if (o["containmentClosureNoDocumentProcessingLaneCreated"] !== true)
    reasons.push("prereq_containment_closure_no_document_processing_lane_created_false");
  if (o["containmentClosureNoUserVisibleDocumentLaneCreated"] !== true)
    reasons.push("prereq_containment_closure_no_user_visible_document_lane_created_false");

  // 8.5W actual mutation/runtime flags
  if (o["actualClosureDecisionOnly"] !== true)
    reasons.push("prereq_actual_closure_decision_only_must_be_true");
  if (o["actualLiveRouteMutationPerformedInThisPhase"] !== false)
    reasons.push("prereq_actual_live_route_mutation_performed_in_this_phase_must_be_false");
  if (o["actualSmartTalkRouteModifiedInThisPhase"] !== false)
    reasons.push("prereq_actual_smart_talk_route_modified_in_this_phase_must_be_false");
  if (o["actualPhotoRouteModifiedInThisPhase"] !== false)
    reasons.push("prereq_actual_photo_route_modified_in_this_phase_must_be_false");
  if (o["actualPaidDocumentBoundaryAlreadyImplementedBy8x5U"] !== true)
    reasons.push("prereq_actual_paid_document_boundary_already_implemented_by_8x5u_must_be_true");
  if (o["actualPaidDocumentBoundaryImplementedInThisPhase"] !== false)
    reasons.push("prereq_actual_paid_document_boundary_implemented_in_this_phase_must_be_false");
  if (o["actualPaidDocumentModeImplemented"] !== false)
    reasons.push("prereq_actual_paid_document_mode_implemented_must_be_false");
  if (o["actualPaymentRuntimeImplemented"] !== false)
    reasons.push("prereq_actual_payment_runtime_implemented_must_be_false");
  if (o["actualCheckoutImplemented"] !== false)
    reasons.push("prereq_actual_checkout_implemented_must_be_false");
  if (o["actualEntitlementRuntimeImplemented"] !== false)
    reasons.push("prereq_actual_entitlement_runtime_implemented_must_be_false");
  if (o["actualServerEntitlementVerificationImplemented"] !== false)
    reasons.push("prereq_actual_server_entitlement_verification_implemented_must_be_false");
  if (o["actualRealDocumentInputPerformed"] !== false)
    reasons.push("prereq_actual_real_document_input_performed_must_be_false");
  if (o["actualRealDocumentProcessingPerformed"] !== false)
    reasons.push("prereq_actual_real_document_processing_performed_must_be_false");
  if (o["actualOcrPerformed"] !== false)
    reasons.push("prereq_actual_ocr_performed_must_be_false");
  if (o["actualPhotoInputProcessed"] !== false)
    reasons.push("prereq_actual_photo_input_processed_must_be_false");
  if (o["actualFileInputProcessed"] !== false)
    reasons.push("prereq_actual_file_input_processed_must_be_false");
  if (o["actualDocumentStoragePerformed"] !== false)
    reasons.push("prereq_actual_document_storage_performed_must_be_false");
  if (o["actualDatabasePersistencePerformed"] !== false)
    reasons.push("prereq_actual_database_persistence_performed_must_be_false");
  if (o["actualAuditPersistencePerformed"] !== false)
    reasons.push("prereq_actual_audit_persistence_performed_must_be_false");
  if (o["actualUserVisibleOutputPerformed"] !== false)
    reasons.push("prereq_actual_user_visible_output_performed_must_be_false");
  if (o["actualPublicRuntimeEnabled"] !== false)
    reasons.push("prereq_actual_public_runtime_enabled_must_be_false");
  if (o["actualPiiRedactionImplemented"] !== false)
    reasons.push("prereq_actual_pii_redaction_implemented_must_be_false");
  if (o["actualEvidenceGateRuntimeWiringPerformed"] !== false)
    reasons.push("prereq_actual_evidence_gate_runtime_wiring_performed_must_be_false");
  if (o["actualClaimAuthorizationPerformed"] !== false)
    reasons.push("prereq_actual_claim_authorization_performed_must_be_false");
  if (o["actualDeadlineCalculationPerformed"] !== false)
    reasons.push("prereq_actual_deadline_calculation_performed_must_be_false");
  if (o["actualPromptBuildPerformed"] !== false)
    reasons.push("prereq_actual_prompt_build_performed_must_be_false");
  if (o["actualModelCallPerformed"] !== false)
    reasons.push("prereq_actual_model_call_performed_must_be_false");
  if (o["actualRunSmartTalkCalled"] !== false)
    reasons.push("prereq_actual_run_smart_talk_called_must_be_false");

  // 8.5W no-prohibited-side-effect confirmations
  if (o["closureDecisionConfirmsNoOpenAiCall"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_openai_call_false");
  if (o["closureDecisionConfirmsNoFetchCall"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_fetch_call_false");
  if (o["closureDecisionConfirmsNoProcessEnvRead"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_process_env_read_false");
  if (o["closureDecisionConfirmsNoSdkUsage"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_sdk_usage_false");
  if (o["closureDecisionConfirmsNo8x3AcRerun"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_8x3ac_rerun_false");
  if (o["closureDecisionConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_payment_runtime_call_false");
  if (o["closureDecisionConfirmsNoStripeCall"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_stripe_call_false");
  if (o["closureDecisionConfirmsNoCheckoutCall"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_checkout_call_false");
  if (o["closureDecisionConfirmsNoEntitlementRuntimeCall"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_entitlement_runtime_call_false");
  if (o["closureDecisionConfirmsNoServerEntitlementVerification"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_server_entitlement_verification_false");
  if (o["closureDecisionConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_ocr_runtime_call_false");
  if (o["closureDecisionConfirmsNoStorageMutation"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_storage_mutation_false");
  if (o["closureDecisionConfirmsNoDatabaseWrite"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_database_write_false");
  if (o["closureDecisionConfirmsNoAuditPersistence"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_audit_persistence_false");
  if (o["closureDecisionConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_user_visible_document_explanation_false");
  if (o["closureDecisionConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_evidence_evaluation_false");
  if (o["closureDecisionConfirmsNoClaimAuthorization"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_claim_authorization_false");
  if (o["closureDecisionConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_deadline_calculation_false");
  if (o["closureDecisionConfirmsNoLegalCertainty"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_legal_certainty_false");
  if (o["closureDecisionConfirmsNoPromptBuild"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_prompt_build_false");
  if (o["closureDecisionConfirmsNoModelCall"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_model_call_false");
  if (o["closureDecisionConfirmsNoRunSmartTalkCall"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_run_smart_talk_call_false");
  if (o["closureDecisionConfirmsNoRouteHandlerCall"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_route_handler_call_false");
  if (o["closureDecisionConfirmsNoRouteImport"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_route_import_false");
  if (o["closureDecisionConfirmsNoFilesystemRead"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_filesystem_read_false");
  if (o["closureDecisionConfirmsNoPhotoRouteModification"] !== true)
    reasons.push("prereq_closure_decision_confirms_no_photo_route_modification_false");

  // Pipeline executed flags (all false)
  if (o["executionSequenceActuallyExecuted"] !== false)
    reasons.push("prereq_execution_sequence_actually_executed_must_be_false");
  if (o["runtimePipelineActuallyExecuted"] !== false)
    reasons.push("prereq_runtime_pipeline_actually_executed_must_be_false");
  if (o["documentPipelineActuallyExecuted"] !== false)
    reasons.push("prereq_document_pipeline_actually_executed_must_be_false");
  if (o["paymentPipelineActuallyExecuted"] !== false)
    reasons.push("prereq_payment_pipeline_actually_executed_must_be_false");
  if (o["entitlementPipelineActuallyExecuted"] !== false)
    reasons.push("prereq_entitlement_pipeline_actually_executed_must_be_false");
  if (o["checkoutPipelineActuallyExecuted"] !== false)
    reasons.push("prereq_checkout_pipeline_actually_executed_must_be_false");
  if (o["ocrPipelineActuallyExecuted"] !== false)
    reasons.push("prereq_ocr_pipeline_actually_executed_must_be_false");
  if (o["userVisiblePipelineActuallyExecuted"] !== false)
    reasons.push("prereq_user_visible_pipeline_actually_executed_must_be_false");

  // Runtime authorization flags (all false)
  if (o["realDocumentInputAuthorizedNow"] !== false)
    reasons.push("prereq_real_document_input_authorized_now_must_be_false");
  if (o["realDocumentProcessingAuthorizedNow"] !== false)
    reasons.push("prereq_real_document_processing_authorized_now_must_be_false");
  if (o["realUserDocumentUploadAuthorizedNow"] !== false)
    reasons.push("prereq_real_user_document_upload_authorized_now_must_be_false");
  if (o["ocrRuntimeAuthorizedNow"] !== false)
    reasons.push("prereq_ocr_runtime_authorized_now_must_be_false");
  if (o["photoInputAuthorizedNow"] !== false)
    reasons.push("prereq_photo_input_authorized_now_must_be_false");
  if (o["fileInputAuthorizedNow"] !== false)
    reasons.push("prereq_file_input_authorized_now_must_be_false");
  if (o["documentStorageAuthorizedNow"] !== false)
    reasons.push("prereq_document_storage_authorized_now_must_be_false");
  if (o["persistenceAuthorizedNow"] !== false)
    reasons.push("prereq_persistence_authorized_now_must_be_false");
  if (o["publicRuntimeAuthorizedNow"] !== false)
    reasons.push("prereq_public_runtime_authorized_now_must_be_false");
  if (o["userVisibleLegalDeadlineOutputAuthorizedNow"] !== false)
    reasons.push("prereq_user_visible_legal_deadline_output_authorized_now_must_be_false");
  if (o["liveLLMRuntimeAuthorizedNow"] !== false)
    reasons.push("prereq_live_llm_runtime_authorized_now_must_be_false");
  if (o["connectedAiRuntimeAuthorizedNow"] !== false)
    reasons.push("prereq_connected_ai_runtime_authorized_now_must_be_false");
  if (o["pilotRuntimeAuthorizedNow"] !== false)
    reasons.push("prereq_pilot_runtime_authorized_now_must_be_false");
  if (o["productionRuntimeAuthorizedNow"] !== false)
    reasons.push("prereq_production_runtime_authorized_now_must_be_false");
  if (o["paidDocumentModeRuntimeAuthorizedNow"] !== false)
    reasons.push("prereq_paid_document_mode_runtime_authorized_now_must_be_false");
  if (o["paymentRuntimeAuthorizedNow"] !== false)
    reasons.push("prereq_payment_runtime_authorized_now_must_be_false");
  if (o["entitlementRuntimeAuthorizedNow"] !== false)
    reasons.push("prereq_entitlement_runtime_authorized_now_must_be_false");
  if (o["checkoutRuntimeAuthorizedNow"] !== false)
    reasons.push("prereq_checkout_runtime_authorized_now_must_be_false");

  // Authorization grants (all false)
  if (o["runtimeAuthorizationGranted"] !== false) reasons.push("prereq_runtime_authorization_granted_must_be_false");
  if (o["pilotAuthorizationGranted"] !== false) reasons.push("prereq_pilot_authorization_granted_must_be_false");
  if (o["productionAuthorizationGranted"] !== false) reasons.push("prereq_production_authorization_granted_must_be_false");
  if (o["finalAuthorizationGranted"] !== false) reasons.push("prereq_final_authorization_granted_must_be_false");
  if (o["goLiveAuthorizationGranted"] !== false) reasons.push("prereq_go_live_authorization_granted_must_be_false");

  // Legal safety flags
  if (o["exactDeadlineCalculationAuthorized"] !== false)
    reasons.push("prereq_exact_deadline_calculation_authorized_must_be_false");
  if (o["deliveryDateInventionAuthorized"] !== false)
    reasons.push("prereq_delivery_date_invention_authorized_must_be_false");
  if (o["finalDateInventionAuthorized"] !== false)
    reasons.push("prereq_final_date_invention_authorized_must_be_false");
  if (o["legalCertaintyAuthorized"] !== false)
    reasons.push("prereq_legal_certainty_authorized_must_be_false");
  if (o["coerciveLegalInstructionAuthorized"] !== false)
    reasons.push("prereq_coercive_legal_instruction_authorized_must_be_false");
  if (o["deliveryDateRequiredForExactDeadline"] !== true)
    reasons.push("prereq_delivery_date_required_for_exact_deadline_false");

  // TD flags from 8.5W result
  if (o["td001DocumentBypassGuardContainmentClosed"] !== true)
    reasons.push("prereq_td001_false");
  if (o["td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed"] !== true)
    reasons.push("prereq_td005_surgical_route_patch_performed_false");
  if (o["td005PaidDocumentModeBoundaryPostPatchContainmentAudited"] !== true)
    reasons.push("prereq_td005_post_patch_containment_audited_false");
  if (o["td005PaidDocumentModeBoundaryContainmentClosed"] !== true)
    reasons.push("prereq_td005_boundary_containment_closed_false");
  if (o["td005PaidDocumentModeClientFlagBypassClosed"] !== true)
    reasons.push("prereq_td005_client_flag_bypass_closed_false");
  if (o["td005PaidDocumentModeActualRuntimeImplementationDeferred"] !== true)
    reasons.push("prereq_td005_actual_runtime_implementation_deferred_false");
  if (o["td005PaidDocumentModeStillRequiresActualRuntimeImplementation"] !== true)
    reasons.push("prereq_td005_still_requires_actual_runtime_implementation_false");
  if (o["td004PreModelPiiRedactionMissing"] !== true)
    reasons.push("prereq_td004_pre_model_pii_redaction_missing_must_be_true");
  if (o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] !== true)
    reasons.push("prereq_td002_false");
  if (o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained"] !== true)
    reasons.push("prereq_td003_contained_false");
  if (o["td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign"] !== true)
    reasons.push("prereq_td003_still_requires_future_authorized_runtime_design_false");
  if (o["td006EvidenceGateTodoAndOrSemanticsUnresolved"] !== true)
    reasons.push("prereq_td006_false");
  if (o["td007TrapClaimDispositionNamespaceHardeningUnresolved"] !== true)
    reasons.push("prereq_td007_false");
  if (o["td008InMemoryRateLimiterServerlessUnsafe"] !== true)
    reasons.push("prereq_td008_false");
  if (o["td010GetUserStateDocumentTypeTodoOpen"] !== true)
    reasons.push("prereq_td010_false");
  if (o["td009TmpDebugRunnerDebtClosed"] !== true)
    reasons.push("prereq_td009_false");
  if (o["tmpFilesPresentInWorkingTree"] !== false)
    reasons.push("prereq_tmp_files_present_in_working_tree_must_be_false");

  // 8.5W forward readiness gate
  if (o["readyForPreModelPiiRedactionPhase"] !== true)
    reasons.push("prereq_ready_for_pre_model_pii_redaction_phase_false");
  if (o["readyForEvidenceGatesProductionWiringPhase"] !== false)
    reasons.push("prereq_ready_for_evidence_gates_production_wiring_phase_must_be_false");
  if (o["readyForServerEntitlementVerificationPhase"] !== false)
    reasons.push("prereq_ready_for_server_entitlement_verification_phase_must_be_false");
  if (o["readyForPaidDocumentModeActualRuntimeImplementationPhase"] !== false)
    reasons.push("prereq_ready_for_paid_document_mode_actual_runtime_implementation_phase_must_be_false");
  if (o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase"] !== false)
    reasons.push("prereq_ready_for_separate_runtime_authorization_must_be_false");
  if (o["readyForControlledRealDocumentPilotAuthorizationPhase"] !== false)
    reasons.push("prereq_ready_for_pilot_authorization_must_be_false");
  if (o["readyForControlledRealDocumentProductionAuthorizationPhase"] !== false)
    reasons.push("prereq_ready_for_production_authorization_must_be_false");
  if (o["readyForRealDocumentInput"] !== false)
    reasons.push("prereq_ready_for_real_document_input_must_be_false");
  if (o["readyForUserVisibleOutput"] !== false)
    reasons.push("prereq_ready_for_user_visible_output_must_be_false");
  if (o["publicRuntimeEnabled"] !== false)
    reasons.push("prereq_public_runtime_enabled_must_be_false");
  if (o["persistenceUsed"] !== false)
    reasons.push("prereq_persistence_used_must_be_false");
  if (o["neverUserVisible"] !== true)
    reasons.push("prereq_never_user_visible_must_be_true");

  // 8.6A core assertion flags
  if (o["paidDocumentModeBoundaryClosureReadyForPiiRedactionPlanning"] !== true)
    reasons.push("boundary_closure_ready_for_pii_redaction_planning_false");
  if (o["preModelPiiRedactionPlanningOnly"] !== true)
    reasons.push("pre_model_pii_redaction_planning_only_false");
  if (o["preModelPiiRedactionPlanDefined"] !== true)
    reasons.push("pre_model_pii_redaction_plan_defined_false");
  if (o["preModelPiiRedactionRuntimeStillNotImplemented"] !== true)
    reasons.push("pre_model_pii_redaction_runtime_still_not_implemented_false");
  if (o["preModelPiiDetectorRuntimeStillNotImplemented"] !== true)
    reasons.push("pre_model_pii_detector_runtime_still_not_implemented_false");
  if (o["preModelPiiMaskingRuntimeStillNotImplemented"] !== true)
    reasons.push("pre_model_pii_masking_runtime_still_not_implemented_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeRealDocumentInput"] !== true)
    reasons.push("pre_model_pii_redaction_does_not_authorize_real_document_input_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput"] !== true)
    reasons.push("pre_model_pii_redaction_does_not_authorize_user_visible_output_false");
  if (o["preModelPiiRedactionDoesNotAuthorizePromptBuild"] !== true)
    reasons.push("pre_model_pii_redaction_does_not_authorize_prompt_build_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeModelCall"] !== true)
    reasons.push("pre_model_pii_redaction_does_not_authorize_model_call_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeRunSmartTalk"] !== true)
    reasons.push("pre_model_pii_redaction_does_not_authorize_run_smart_talk_false");

  // Planning confirmations
  if (o["piiPlanRequiresBoundaryBeforePromptBuild"] !== true)
    reasons.push("pii_plan_requires_boundary_before_prompt_build_false");
  if (o["piiPlanRequiresBoundaryBeforeModelCall"] !== true)
    reasons.push("pii_plan_requires_boundary_before_model_call_false");
  if (o["piiPlanRequiresBoundaryBeforeRunSmartTalkDocumentLane"] !== true)
    reasons.push("pii_plan_requires_boundary_before_run_smart_talk_document_lane_false");
  if (o["piiPlanRequiresBoundaryAfterControlledInputValidation"] !== true)
    reasons.push("pii_plan_requires_boundary_after_controlled_input_validation_false");
  if (o["piiPlanRequiresBoundaryBeforeEvidenceGateEvaluation"] !== true)
    reasons.push("pii_plan_requires_boundary_before_evidence_gate_evaluation_false");
  if (o["piiPlanDoesNotCreateFreeQaDocumentBypass"] !== true)
    reasons.push("pii_plan_does_not_create_free_qa_document_bypass_false");
  if (o["piiPlanDoesNotAuthorizeRealDocumentInput"] !== true)
    reasons.push("pii_plan_does_not_authorize_real_document_input_false");
  if (o["piiPlanDoesNotAuthorizeUserVisibleDocumentOutput"] !== true)
    reasons.push("pii_plan_does_not_authorize_user_visible_document_output_false");
  if (o["piiPlanDoesNotAuthorizeExactDeadlineCalculation"] !== true)
    reasons.push("pii_plan_does_not_authorize_exact_deadline_calculation_false");
  if (o["piiPlanDoesNotAuthorizePublicRuntime"] !== true)
    reasons.push("pii_plan_does_not_authorize_public_runtime_false");

  // PII class coverage
  if (o["piiPlanCoversPersonNames"] !== true) reasons.push("pii_plan_covers_person_names_false");
  if (o["piiPlanCoversPostalAddresses"] !== true) reasons.push("pii_plan_covers_postal_addresses_false");
  if (o["piiPlanCoversPhoneNumbers"] !== true) reasons.push("pii_plan_covers_phone_numbers_false");
  if (o["piiPlanCoversEmailAddresses"] !== true) reasons.push("pii_plan_covers_email_addresses_false");
  if (o["piiPlanCoversDatesOfBirth"] !== true) reasons.push("pii_plan_covers_dates_of_birth_false");
  if (o["piiPlanCoversCustomerNumbers"] !== true) reasons.push("pii_plan_covers_customer_numbers_false");
  if (o["piiPlanCoversInsuranceNumbers"] !== true) reasons.push("pii_plan_covers_insurance_numbers_false");
  if (o["piiPlanCoversHealthInsuranceIdentifiers"] !== true) reasons.push("pii_plan_covers_health_insurance_identifiers_false");
  if (o["piiPlanCoversTaxIds"] !== true) reasons.push("pii_plan_covers_tax_ids_false");
  if (o["piiPlanCoversSteuerId"] !== true) reasons.push("pii_plan_covers_steuer_id_false");
  if (o["piiPlanCoversSteuernummer"] !== true) reasons.push("pii_plan_covers_steuernummer_false");
  if (o["piiPlanCoversAktenzeichen"] !== true) reasons.push("pii_plan_covers_aktenzeichen_false");
  if (o["piiPlanCoversVorgangsnummer"] !== true) reasons.push("pii_plan_covers_vorgangsnummer_false");
  if (o["piiPlanCoversCaseReferenceNumbers"] !== true) reasons.push("pii_plan_covers_case_reference_numbers_false");
  if (o["piiPlanCoversIban"] !== true) reasons.push("pii_plan_covers_iban_false");
  if (o["piiPlanCoversBankAccountIdentifiers"] !== true) reasons.push("pii_plan_covers_bank_account_identifiers_false");
  if (o["piiPlanCoversLicensePlateNumbers"] !== true) reasons.push("pii_plan_covers_license_plate_numbers_false");
  if (o["piiPlanCoversEmployerNamesInPersonalContext"] !== true) reasons.push("pii_plan_covers_employer_names_in_personal_context_false");
  if (o["piiPlanCoversSignatures"] !== true) reasons.push("pii_plan_covers_signatures_false");
  if (o["piiPlanCoversHandwrittenNames"] !== true) reasons.push("pii_plan_covers_handwritten_names_false");
  if (o["piiPlanCoversGreetingsContainingPersonalNames"] !== true) reasons.push("pii_plan_covers_greetings_containing_personal_names_false");
  if (o["piiPlanCoversDocumentRecipientBlocks"] !== true) reasons.push("pii_plan_covers_document_recipient_blocks_false");
  if (o["piiPlanCoversSenderBlocks"] !== true) reasons.push("pii_plan_covers_sender_blocks_false");
  if (o["piiPlanCoversRealContactDetails"] !== true) reasons.push("pii_plan_covers_real_contact_details_false");
  if (o["piiPlanCoversRealAuthorityContactBlocksCopiedFromDocuments"] !== true) reasons.push("pii_plan_covers_real_authority_contact_blocks_copied_from_documents_false");
  if (o["piiPlanCoversMedicalHealthContextIdentifiers"] !== true) reasons.push("pii_plan_covers_medical_health_context_identifiers_false");
  if (o["piiPlanCoversImmigrationResidencePermitIdentifiers"] !== true) reasons.push("pii_plan_covers_immigration_residence_permit_identifiers_false");
  if (o["piiPlanCoversSocialBenefitIdentifiers"] !== true) reasons.push("pii_plan_covers_social_benefit_identifiers_false");
  if (o["piiPlanCoversJobcenterBuergergeldIdentifiers"] !== true) reasons.push("pii_plan_covers_jobcenter_buergergeld_identifiers_false");
  if (o["piiPlanCoversFamilienkasseKindergeldIdentifiers"] !== true) reasons.push("pii_plan_covers_familienkasse_kindergeld_identifiers_false");
  if (o["piiPlanCoversAuslaenderbehoerdeIdentifiers"] !== true) reasons.push("pii_plan_covers_auslaenderbehoerde_identifiers_false");
  if (o["piiPlanCoversFinanzamtIdentifiers"] !== true) reasons.push("pii_plan_covers_finanzamt_identifiers_false");

  // Redaction/masking requirements
  if (o["piiPlanRequiresDeterministicPlaceholders"] !== true)
    reasons.push("pii_plan_requires_deterministic_placeholders_false");
  if (o["piiPlanRequiresStablePlaceholderMappingInsideOneRequest"] !== true)
    reasons.push("pii_plan_requires_stable_placeholder_mapping_inside_one_request_false");
  if (o["piiPlanRequiresNoRawPiiPersistenceByDefault"] !== true)
    reasons.push("pii_plan_requires_no_raw_pii_persistence_by_default_false");
  if (o["piiPlanRequiresNoRawPiiInPrompt"] !== true)
    reasons.push("pii_plan_requires_no_raw_pii_in_prompt_false");
  if (o["piiPlanRequiresNoRawPiiInLogs"] !== true)
    reasons.push("pii_plan_requires_no_raw_pii_in_logs_false");
  if (o["piiPlanRequiresNoRawPiiInAuditTraces"] !== true)
    reasons.push("pii_plan_requires_no_raw_pii_in_audit_traces_false");
  if (o["piiPlanRequiresNoRawPiiInUserVisibleErrorMessages"] !== true)
    reasons.push("pii_plan_requires_no_raw_pii_in_user_visible_error_messages_false");
  if (o["piiPlanRequiresNoRawPiiInTelemetry"] !== true)
    reasons.push("pii_plan_requires_no_raw_pii_in_telemetry_false");
  if (o["piiPlanRequiresNoRawPiiInModelMetadata"] !== true)
    reasons.push("pii_plan_requires_no_raw_pii_in_model_metadata_false");
  if (o["piiPlanRequiresNoRawPiiInEvidenceGateTraces"] !== true)
    reasons.push("pii_plan_requires_no_raw_pii_in_evidence_gate_traces_false");
  if (o["piiPlanRequiresNoRawPiiInDeadlineTraces"] !== true)
    reasons.push("pii_plan_requires_no_raw_pii_in_deadline_traces_false");
  if (o["piiPlanRequiresRawToPlaceholderMapLocalEphemeralByDefault"] !== true)
    reasons.push("pii_plan_requires_raw_to_placeholder_map_local_ephemeral_by_default_false");
  if (o["piiPlanRequiresStructuredRedactionAuditWithoutRawValues"] !== true)
    reasons.push("pii_plan_requires_structured_redaction_audit_without_raw_values_false");
  if (o["piiPlanRequiresCoverageMetricsWithoutRawValues"] !== true)
    reasons.push("pii_plan_requires_coverage_metrics_without_raw_values_false");
  if (o["piiPlanRequiresConservativeFallbackWhenConfidenceUncertain"] !== true)
    reasons.push("pii_plan_requires_conservative_fallback_when_confidence_uncertain_false");
  if (o["piiPlanRequiresBlockOrEscalateIfUnsafeToRedact"] !== true)
    reasons.push("pii_plan_requires_block_or_escalate_if_unsafe_to_redact_false");

  // Placeholder plan confirmations
  if (o["piiPlanAllowsPersonPlaceholder"] !== true) reasons.push("pii_plan_allows_person_placeholder_false");
  if (o["piiPlanAllowsAddressPlaceholder"] !== true) reasons.push("pii_plan_allows_address_placeholder_false");
  if (o["piiPlanAllowsPhonePlaceholder"] !== true) reasons.push("pii_plan_allows_phone_placeholder_false");
  if (o["piiPlanAllowsEmailPlaceholder"] !== true) reasons.push("pii_plan_allows_email_placeholder_false");
  if (o["piiPlanAllowsDobPlaceholder"] !== true) reasons.push("pii_plan_allows_dob_placeholder_false");
  if (o["piiPlanAllowsCustomerIdPlaceholder"] !== true) reasons.push("pii_plan_allows_customer_id_placeholder_false");
  if (o["piiPlanAllowsInsuranceIdPlaceholder"] !== true) reasons.push("pii_plan_allows_insurance_id_placeholder_false");
  if (o["piiPlanAllowsTaxIdPlaceholder"] !== true) reasons.push("pii_plan_allows_tax_id_placeholder_false");
  if (o["piiPlanAllowsCaseRefPlaceholder"] !== true) reasons.push("pii_plan_allows_case_ref_placeholder_false");
  if (o["piiPlanAllowsIbanPlaceholder"] !== true) reasons.push("pii_plan_allows_iban_placeholder_false");
  if (o["piiPlanAllowsAuthorityPlaceholder"] !== true) reasons.push("pii_plan_allows_authority_placeholder_false");
  if (o["piiPlanAllowsEmployerPlaceholder"] !== true) reasons.push("pii_plan_allows_employer_placeholder_false");
  if (o["piiPlanAllowsSignaturePlaceholder"] !== true) reasons.push("pii_plan_allows_signature_placeholder_false");
  if (o["piiPlanAllowsDocumentRecipientPlaceholder"] !== true) reasons.push("pii_plan_allows_document_recipient_placeholder_false");
  if (o["piiPlanAllowsDocumentSenderPlaceholder"] !== true) reasons.push("pii_plan_allows_document_sender_placeholder_false");

  // Safety confirmations
  if (o["piiPlanPreservesLegalSemanticStructureWherePossible"] !== true)
    reasons.push("pii_plan_preserves_legal_semantic_structure_where_possible_false");
  if (o["piiPlanMustNotInventMissingFacts"] !== true)
    reasons.push("pii_plan_must_not_invent_missing_facts_false");
  if (o["piiPlanMustNotAlterDatesIntoFalseDeadlines"] !== true)
    reasons.push("pii_plan_must_not_alter_dates_into_false_deadlines_false");
  if (o["piiPlanMarksProtectedIdentifiersInsteadOfSilentDeletion"] !== true)
    reasons.push("pii_plan_marks_protected_identifiers_instead_of_silent_deletion_false");
  if (o["piiPlanMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity"] !== true)
    reasons.push("pii_plan_must_not_convert_unknown_authority_text_into_verified_authority_identity_false");
  if (o["piiPlanMustNotInferRecipientIdentityFromPartialText"] !== true)
    reasons.push("pii_plan_must_not_infer_recipient_identity_from_partial_text_false");
  if (o["piiPlanMustNotInferSenderIdentityFromPartialText"] !== true)
    reasons.push("pii_plan_must_not_infer_sender_identity_from_partial_text_false");
  if (o["piiPlanMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone"] !== true)
    reasons.push("pii_plan_must_not_classify_document_as_legally_sufficient_based_on_redaction_alone_false");
  if (o["piiPlanRedactionSuccessDoesNotAuthorizeFinalLegalAdvice"] !== true)
    reasons.push("pii_plan_redaction_success_does_not_authorize_final_legal_advice_false");
  if (o["piiPlanRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation"] !== true)
    reasons.push("pii_plan_redaction_success_does_not_authorize_exact_deadline_calculation_false");
  if (o["piiPlanRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer"] !== true)
    reasons.push("pii_plan_redaction_success_does_not_authorize_user_visible_document_answer_false");
  if (o["piiPlanRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation"] !== true)
    reasons.push("pii_plan_redaction_success_only_unlocks_possible_later_evidence_gate_evaluation_false");

  // Failure mode confirmations
  if (o["piiPlanDefinesFailurePiiRedactionRequired"] !== true)
    reasons.push("pii_plan_defines_failure_pii_redaction_required_false");
  if (o["piiPlanDefinesFailurePiiRedactionIncomplete"] !== true)
    reasons.push("pii_plan_defines_failure_pii_redaction_incomplete_false");
  if (o["piiPlanDefinesFailurePiiRedactionConfidenceLow"] !== true)
    reasons.push("pii_plan_defines_failure_pii_redaction_confidence_low_false");
  if (o["piiPlanDefinesFailurePiiRedactionUnsafeForModel"] !== true)
    reasons.push("pii_plan_defines_failure_pii_redaction_unsafe_for_model_false");
  if (o["piiPlanDefinesFailureBlockedHighRiskIdentifier"] !== true)
    reasons.push("pii_plan_defines_failure_blocked_high_risk_identifier_false");
  if (o["piiPlanDefinesFailureBlockedMedicalIdentifier"] !== true)
    reasons.push("pii_plan_defines_failure_blocked_medical_identifier_false");
  if (o["piiPlanDefinesFailureBlockedImmigrationIdentifier"] !== true)
    reasons.push("pii_plan_defines_failure_blocked_immigration_identifier_false");
  if (o["piiPlanDefinesFailureBlockedFinancialIdentifier"] !== true)
    reasons.push("pii_plan_defines_failure_blocked_financial_identifier_false");
  if (o["piiPlanDefinesFailureBlockedUnknownDocumentIdentity"] !== true)
    reasons.push("pii_plan_defines_failure_blocked_unknown_document_identity_false");

  // Downstream confirmations
  if (o["piiPlanRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly"] !== true)
    reasons.push("pii_plan_requires_evidence_gates_consume_redacted_or_isolated_content_only_false");
  if (o["piiPlanRequiresClaimAuthorizationUseRedactedAnchorsOnly"] !== true)
    reasons.push("pii_plan_requires_claim_authorization_use_redacted_anchors_only_false");
  if (o["piiPlanRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized"] !== true)
    reasons.push("pii_plan_requires_user_visible_output_not_reveal_raw_pii_unless_separately_authorized_false");
  if (o["piiPlanRequiresAuditTracesUsePlaceholderCategoriesOnly"] !== true)
    reasons.push("pii_plan_requires_audit_traces_use_placeholder_categories_only_false");
  if (o["piiPlanRequiresDeadlineLogicStillRequireDeliveryDateEvidence"] !== true)
    reasons.push("pii_plan_requires_deadline_logic_still_require_delivery_date_evidence_false");
  if (o["piiPlanRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized"] !== true)
    reasons.push("pii_plan_requires_storage_persistence_remain_blocked_until_separately_authorized_false");
  if (o["piiPlanRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts"] !== true)
    reasons.push("pii_plan_requires_paid_document_runtime_remain_blocked_false");

  // 8.6A new actual flags
  if (o["actualPiiRedactionPlanOnly"] !== true)
    reasons.push("actual_pii_redaction_plan_only_must_be_true");
  if (o["actualPiiDetectorRuntimeImplemented"] !== false)
    reasons.push("actual_pii_detector_runtime_implemented_must_be_false");
  if (o["actualPiiMaskingRuntimeImplemented"] !== false)
    reasons.push("actual_pii_masking_runtime_implemented_must_be_false");
  if (o["actualPiiTextRedacted"] !== false)
    reasons.push("actual_pii_text_redacted_must_be_false");
  if (o["actualRawPiiProcessed"] !== false)
    reasons.push("actual_raw_pii_processed_must_be_false");
  if (o["actualRawPiiPersisted"] !== false)
    reasons.push("actual_raw_pii_persisted_must_be_false");
  if (o["actualRawPiiLogged"] !== false)
    reasons.push("actual_raw_pii_logged_must_be_false");

  // 8.6A no-prohibited-side-effect confirmations
  if (o["piiPlanConfirmsNoOpenAiCall"] !== true) reasons.push("pii_plan_confirms_no_openai_call_false");
  if (o["piiPlanConfirmsNoFetchCall"] !== true) reasons.push("pii_plan_confirms_no_fetch_call_false");
  if (o["piiPlanConfirmsNoProcessEnvRead"] !== true) reasons.push("pii_plan_confirms_no_process_env_read_false");
  if (o["piiPlanConfirmsNoSdkUsage"] !== true) reasons.push("pii_plan_confirms_no_sdk_usage_false");
  if (o["piiPlanConfirmsNo8x3AcRerun"] !== true) reasons.push("pii_plan_confirms_no_8x3ac_rerun_false");
  if (o["piiPlanConfirmsNoPaymentRuntimeCall"] !== true) reasons.push("pii_plan_confirms_no_payment_runtime_call_false");
  if (o["piiPlanConfirmsNoStripeCall"] !== true) reasons.push("pii_plan_confirms_no_stripe_call_false");
  if (o["piiPlanConfirmsNoCheckoutCall"] !== true) reasons.push("pii_plan_confirms_no_checkout_call_false");
  if (o["piiPlanConfirmsNoEntitlementRuntimeCall"] !== true) reasons.push("pii_plan_confirms_no_entitlement_runtime_call_false");
  if (o["piiPlanConfirmsNoServerEntitlementVerification"] !== true) reasons.push("pii_plan_confirms_no_server_entitlement_verification_false");
  if (o["piiPlanConfirmsNoOcrRuntimeCall"] !== true) reasons.push("pii_plan_confirms_no_ocr_runtime_call_false");
  if (o["piiPlanConfirmsNoStorageMutation"] !== true) reasons.push("pii_plan_confirms_no_storage_mutation_false");
  if (o["piiPlanConfirmsNoDatabaseWrite"] !== true) reasons.push("pii_plan_confirms_no_database_write_false");
  if (o["piiPlanConfirmsNoAuditPersistence"] !== true) reasons.push("pii_plan_confirms_no_audit_persistence_false");
  if (o["piiPlanConfirmsNoUserVisibleDocumentExplanation"] !== true) reasons.push("pii_plan_confirms_no_user_visible_document_explanation_false");
  if (o["piiPlanConfirmsNoEvidenceEvaluation"] !== true) reasons.push("pii_plan_confirms_no_evidence_evaluation_false");
  if (o["piiPlanConfirmsNoClaimAuthorization"] !== true) reasons.push("pii_plan_confirms_no_claim_authorization_false");
  if (o["piiPlanConfirmsNoDeadlineCalculation"] !== true) reasons.push("pii_plan_confirms_no_deadline_calculation_false");
  if (o["piiPlanConfirmsNoLegalCertainty"] !== true) reasons.push("pii_plan_confirms_no_legal_certainty_false");
  if (o["piiPlanConfirmsNoPromptBuild"] !== true) reasons.push("pii_plan_confirms_no_prompt_build_false");
  if (o["piiPlanConfirmsNoModelCall"] !== true) reasons.push("pii_plan_confirms_no_model_call_false");
  if (o["piiPlanConfirmsNoRunSmartTalkCall"] !== true) reasons.push("pii_plan_confirms_no_run_smart_talk_call_false");
  if (o["piiPlanConfirmsNoRouteHandlerCall"] !== true) reasons.push("pii_plan_confirms_no_route_handler_call_false");
  if (o["piiPlanConfirmsNoRouteImport"] !== true) reasons.push("pii_plan_confirms_no_route_import_false");
  if (o["piiPlanConfirmsNoFilesystemRead"] !== true) reasons.push("pii_plan_confirms_no_filesystem_read_false");
  if (o["piiPlanConfirmsNoPhotoRouteModification"] !== true) reasons.push("pii_plan_confirms_no_photo_route_modification_false");

  // 8.6A pipeline executed flags (new)
  if (o["piiPipelineActuallyExecuted"] !== false)
    reasons.push("pii_pipeline_actually_executed_must_be_false");

  // 8.6A runtime authorization flags (new)
  if (o["preModelPiiRedactionRuntimeAuthorizedNow"] !== false)
    reasons.push("pre_model_pii_redaction_runtime_authorized_now_must_be_false");

  // 8.6A TD result flags
  if (o["td004PreModelPiiRedactionPlanned"] !== true)
    reasons.push("td004_pre_model_pii_redaction_planned_false");
  if (o["td004PreModelPiiRedactionStillRequiresContract"] !== true)
    reasons.push("td004_pre_model_pii_redaction_still_requires_contract_false");
  if (o["td004PreModelPiiRedactionStillRequiresRuntimeImplementation"] !== true)
    reasons.push("td004_pre_model_pii_redaction_still_requires_runtime_implementation_false");
  if (o["td004PreModelPiiRedactionStillMissingInProduction"] !== true)
    reasons.push("td004_pre_model_pii_redaction_still_missing_in_production_false");

  // 8.6A forward readiness
  if (o["readyFor8x6BPreModelPiiRedactionContract"] !== true)
    reasons.push("ready_for_8x6b_pre_model_pii_redaction_contract_false");

  return { accepted: reasons.length === 0, reasons };
}

// ── Canonical 8.6A input ──────────────────────────────────────────────────────

function buildCanonical8x6AInput(): ControlledRealDocumentPreModelPiiRedactionPlanInput {
  const cr = runControlledRealDocumentPaidDocumentModeBoundaryClosureDecision();
  return {
    // 8.5W prerequisite gate — core
    prereqCheckId: cr.checkId,
    prereqAllPassed: cr.allPassed,
    paidDocumentModeBoundaryPostPatchAuditReadyForClosureDecision:
      cr.paidDocumentModeBoundaryPostPatchAuditReadyForClosureDecision,
    controlledRealDocumentPaidDocumentModeBoundaryClosureDecisionAccepted:
      cr.controlledRealDocumentPaidDocumentModeBoundaryClosureDecisionAccepted,
    paidDocumentModeBoundaryClosureDecisionOnly: cr.paidDocumentModeBoundaryClosureDecisionOnly,
    paidDocumentModeBoundaryContainmentClosed: cr.paidDocumentModeBoundaryContainmentClosed,
    paidDocumentModeBoundaryClientFlagBypassClosed: cr.paidDocumentModeBoundaryClientFlagBypassClosed,
    paidDocumentModeBoundaryDenyByDefaultClosed: cr.paidDocumentModeBoundaryDenyByDefaultClosed,
    paidDocumentModeBoundaryServerEntitlementRequirementPreserved:
      cr.paidDocumentModeBoundaryServerEntitlementRequirementPreserved,
    paidDocumentModeBoundaryActualRuntimeStillDeferred: cr.paidDocumentModeBoundaryActualRuntimeStillDeferred,
    paidDocumentModeRuntimeStillNotImplemented: cr.paidDocumentModeRuntimeStillNotImplemented,
    paidDocumentModePaymentRuntimeStillNotImplemented: cr.paidDocumentModePaymentRuntimeStillNotImplemented,
    paidDocumentModeCheckoutRuntimeStillNotImplemented: cr.paidDocumentModeCheckoutRuntimeStillNotImplemented,
    paidDocumentModeEntitlementRuntimeStillNotImplemented:
      cr.paidDocumentModeEntitlementRuntimeStillNotImplemented,
    paidDocumentModeServerEntitlementVerificationStillNotImplemented:
      cr.paidDocumentModeServerEntitlementVerificationStillNotImplemented,
    paidDocumentModeDocumentProcessingStillNotAuthorized:
      cr.paidDocumentModeDocumentProcessingStillNotAuthorized,
    paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized:
      cr.paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized,
    prereqTamperCasesRejected: cr.tamperCasesRejected,

    // 8.5W closure decision fields
    closureDecisionTd005ContainmentClosed: cr.closureDecisionTd005ContainmentClosed,
    closureDecisionTd005ClientFlagBypassClosed: cr.closureDecisionTd005ClientFlagBypassClosed,
    closureDecisionTd005BoundaryPatchAccepted: cr.closureDecisionTd005BoundaryPatchAccepted,
    closureDecisionTd005PostPatchAuditAccepted: cr.closureDecisionTd005PostPatchAuditAccepted,
    closureDecisionTd005RuntimeImplementationDeferred: cr.closureDecisionTd005RuntimeImplementationDeferred,
    closureDecisionDoesNotAuthorizePaidDocumentModeRuntime:
      cr.closureDecisionDoesNotAuthorizePaidDocumentModeRuntime,
    closureDecisionDoesNotAuthorizePaymentRuntime: cr.closureDecisionDoesNotAuthorizePaymentRuntime,
    closureDecisionDoesNotAuthorizeCheckoutRuntime: cr.closureDecisionDoesNotAuthorizeCheckoutRuntime,
    closureDecisionDoesNotAuthorizeEntitlementRuntime: cr.closureDecisionDoesNotAuthorizeEntitlementRuntime,
    closureDecisionDoesNotAuthorizeServerEntitlementVerification:
      cr.closureDecisionDoesNotAuthorizeServerEntitlementVerification,
    closureDecisionDoesNotAuthorizeDocumentProcessing: cr.closureDecisionDoesNotAuthorizeDocumentProcessing,
    closureDecisionDoesNotAuthorizeOcrRuntime: cr.closureDecisionDoesNotAuthorizeOcrRuntime,
    closureDecisionDoesNotAuthorizeFileRuntime: cr.closureDecisionDoesNotAuthorizeFileRuntime,
    closureDecisionDoesNotAuthorizeStorage: cr.closureDecisionDoesNotAuthorizeStorage,
    closureDecisionDoesNotAuthorizePersistence: cr.closureDecisionDoesNotAuthorizePersistence,
    closureDecisionDoesNotAuthorizeUserVisibleDocumentOutput:
      cr.closureDecisionDoesNotAuthorizeUserVisibleDocumentOutput,
    closureDecisionDoesNotAuthorizePublicRuntime: cr.closureDecisionDoesNotAuthorizePublicRuntime,
    closureDecisionDoesNotAuthorizePilotRuntime: cr.closureDecisionDoesNotAuthorizePilotRuntime,
    closureDecisionDoesNotAuthorizeProductionRuntime: cr.closureDecisionDoesNotAuthorizeProductionRuntime,
    closureDecisionRequiresFutureActualRuntimeImplementation:
      cr.closureDecisionRequiresFutureActualRuntimeImplementation,
    closureDecisionRequiresFuturePreModelPiiRedaction: cr.closureDecisionRequiresFuturePreModelPiiRedaction,
    closureDecisionRequiresFutureEvidenceGatesProductionWiring:
      cr.closureDecisionRequiresFutureEvidenceGatesProductionWiring,
    closureDecisionRequiresFutureServerEntitlementVerification:
      cr.closureDecisionRequiresFutureServerEntitlementVerification,
    closureDecisionRequiresFutureUserVisibleOutputContract:
      cr.closureDecisionRequiresFutureUserVisibleOutputContract,
    closureDecisionRequiresFuturePilotAuthorization: cr.closureDecisionRequiresFuturePilotAuthorization,

    // 8.5W containment closure confirmations
    containmentClosure8x5UDenyBoundaryAccepted: cr.containmentClosure8x5UDenyBoundaryAccepted,
    containmentClosure8x5VAuditAccepted: cr.containmentClosure8x5VAuditAccepted,
    containmentClosureSmartTalkRouteDenyBoundaryConfirmed:
      cr.containmentClosureSmartTalkRouteDenyBoundaryConfirmed,
    containmentClosureBoundaryBeforeRunSmartTalkConfirmed:
      cr.containmentClosureBoundaryBeforeRunSmartTalkConfirmed,
    containmentClosureBoundaryAfterJsonParseConfirmed: cr.containmentClosureBoundaryAfterJsonParseConfirmed,
    containmentClosureBoundaryAfterTextValidationConfirmed:
      cr.containmentClosureBoundaryAfterTextValidationConfirmed,
    containmentClosureFreeQaLanePreserved: cr.containmentClosureFreeQaLanePreserved,
    containmentClosureGeneralQuestionsPreserved: cr.containmentClosureGeneralQuestionsPreserved,
    containmentClosure8x5NDocumentBypassGuardPreserved: cr.containmentClosure8x5NDocumentBypassGuardPreserved,
    containmentClosureDocumentLikeTextBlockingPreserved: cr.containmentClosureDocumentLikeTextBlockingPreserved,
    containmentClosure8x5HPhotoOcrQuarantinePreserved: cr.containmentClosure8x5HPhotoOcrQuarantinePreserved,
    containmentClosurePhotoRouteUnmodified: cr.containmentClosurePhotoRouteUnmodified,
    containmentClosureNoPhotoRuntimeEnabled: cr.containmentClosureNoPhotoRuntimeEnabled,
    containmentClosureNoOcrRuntimeEnabled: cr.containmentClosureNoOcrRuntimeEnabled,
    containmentClosureNoFileRuntimeEnabled: cr.containmentClosureNoFileRuntimeEnabled,
    containmentClosureNoStorageEnabled: cr.containmentClosureNoStorageEnabled,
    containmentClosureNoPersistenceEnabled: cr.containmentClosureNoPersistenceEnabled,
    containmentClosureNoPublicDocumentRuntimeEnabled: cr.containmentClosureNoPublicDocumentRuntimeEnabled,
    containmentClosureClientFlagsRemainUntrusted: cr.containmentClosureClientFlagsRemainUntrusted,
    containmentClosureNoEntitledLaneCreated: cr.containmentClosureNoEntitledLaneCreated,
    containmentClosureNoPaymentLaneCreated: cr.containmentClosureNoPaymentLaneCreated,
    containmentClosureNoDocumentProcessingLaneCreated: cr.containmentClosureNoDocumentProcessingLaneCreated,
    containmentClosureNoUserVisibleDocumentLaneCreated: cr.containmentClosureNoUserVisibleDocumentLaneCreated,

    // 8.5W actual mutation/runtime flags
    actualClosureDecisionOnly: cr.actualClosureDecisionOnly,
    actualLiveRouteMutationPerformedInThisPhase: cr.actualLiveRouteMutationPerformedInThisPhase,
    actualSmartTalkRouteModifiedInThisPhase: cr.actualSmartTalkRouteModifiedInThisPhase,
    actualPhotoRouteModifiedInThisPhase: cr.actualPhotoRouteModifiedInThisPhase,
    actualPaidDocumentBoundaryAlreadyImplementedBy8x5U: cr.actualPaidDocumentBoundaryAlreadyImplementedBy8x5U,
    actualPaidDocumentBoundaryImplementedInThisPhase: cr.actualPaidDocumentBoundaryImplementedInThisPhase,
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
    actualPiiRedactionImplemented: cr.actualPiiRedactionImplemented,
    actualEvidenceGateRuntimeWiringPerformed: cr.actualEvidenceGateRuntimeWiringPerformed,
    actualClaimAuthorizationPerformed: cr.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: cr.actualDeadlineCalculationPerformed,
    actualPromptBuildPerformed: cr.actualPromptBuildPerformed,
    actualModelCallPerformed: cr.actualModelCallPerformed,
    actualRunSmartTalkCalled: cr.actualRunSmartTalkCalled,

    // 8.5W no-prohibited-side-effect confirmations
    closureDecisionConfirmsNoOpenAiCall: cr.closureDecisionConfirmsNoOpenAiCall,
    closureDecisionConfirmsNoFetchCall: cr.closureDecisionConfirmsNoFetchCall,
    closureDecisionConfirmsNoProcessEnvRead: cr.closureDecisionConfirmsNoProcessEnvRead,
    closureDecisionConfirmsNoSdkUsage: cr.closureDecisionConfirmsNoSdkUsage,
    closureDecisionConfirmsNo8x3AcRerun: cr.closureDecisionConfirmsNo8x3AcRerun,
    closureDecisionConfirmsNoPaymentRuntimeCall: cr.closureDecisionConfirmsNoPaymentRuntimeCall,
    closureDecisionConfirmsNoStripeCall: cr.closureDecisionConfirmsNoStripeCall,
    closureDecisionConfirmsNoCheckoutCall: cr.closureDecisionConfirmsNoCheckoutCall,
    closureDecisionConfirmsNoEntitlementRuntimeCall: cr.closureDecisionConfirmsNoEntitlementRuntimeCall,
    closureDecisionConfirmsNoServerEntitlementVerification:
      cr.closureDecisionConfirmsNoServerEntitlementVerification,
    closureDecisionConfirmsNoOcrRuntimeCall: cr.closureDecisionConfirmsNoOcrRuntimeCall,
    closureDecisionConfirmsNoStorageMutation: cr.closureDecisionConfirmsNoStorageMutation,
    closureDecisionConfirmsNoDatabaseWrite: cr.closureDecisionConfirmsNoDatabaseWrite,
    closureDecisionConfirmsNoAuditPersistence: cr.closureDecisionConfirmsNoAuditPersistence,
    closureDecisionConfirmsNoUserVisibleDocumentExplanation:
      cr.closureDecisionConfirmsNoUserVisibleDocumentExplanation,
    closureDecisionConfirmsNoEvidenceEvaluation: cr.closureDecisionConfirmsNoEvidenceEvaluation,
    closureDecisionConfirmsNoClaimAuthorization: cr.closureDecisionConfirmsNoClaimAuthorization,
    closureDecisionConfirmsNoDeadlineCalculation: cr.closureDecisionConfirmsNoDeadlineCalculation,
    closureDecisionConfirmsNoLegalCertainty: cr.closureDecisionConfirmsNoLegalCertainty,
    closureDecisionConfirmsNoPromptBuild: cr.closureDecisionConfirmsNoPromptBuild,
    closureDecisionConfirmsNoModelCall: cr.closureDecisionConfirmsNoModelCall,
    closureDecisionConfirmsNoRunSmartTalkCall: cr.closureDecisionConfirmsNoRunSmartTalkCall,
    closureDecisionConfirmsNoRouteHandlerCall: cr.closureDecisionConfirmsNoRouteHandlerCall,
    closureDecisionConfirmsNoRouteImport: cr.closureDecisionConfirmsNoRouteImport,
    closureDecisionConfirmsNoFilesystemRead: cr.closureDecisionConfirmsNoFilesystemRead,
    closureDecisionConfirmsNoPhotoRouteModification: cr.closureDecisionConfirmsNoPhotoRouteModification,

    // Pipeline executed flags
    executionSequenceActuallyExecuted: cr.executionSequenceActuallyExecuted,
    runtimePipelineActuallyExecuted: cr.runtimePipelineActuallyExecuted,
    documentPipelineActuallyExecuted: cr.documentPipelineActuallyExecuted,
    paymentPipelineActuallyExecuted: cr.paymentPipelineActuallyExecuted,
    entitlementPipelineActuallyExecuted: cr.entitlementPipelineActuallyExecuted,
    checkoutPipelineActuallyExecuted: cr.checkoutPipelineActuallyExecuted,
    ocrPipelineActuallyExecuted: cr.ocrPipelineActuallyExecuted,
    userVisiblePipelineActuallyExecuted: cr.userVisiblePipelineActuallyExecuted,

    // Runtime authorization flags
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

    // Authorization grants
    runtimeAuthorizationGranted: cr.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: cr.pilotAuthorizationGranted,
    productionAuthorizationGranted: cr.productionAuthorizationGranted,
    finalAuthorizationGranted: cr.finalAuthorizationGranted,
    goLiveAuthorizationGranted: cr.goLiveAuthorizationGranted,

    // Legal safety flags
    exactDeadlineCalculationAuthorized: cr.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: cr.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: cr.finalDateInventionAuthorized,
    legalCertaintyAuthorized: cr.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: cr.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: cr.deliveryDateRequiredForExactDeadline,

    // TD flags from 8.5W result
    td001DocumentBypassGuardContainmentClosed: cr.td001DocumentBypassGuardContainmentClosed,
    td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed:
      cr.td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed,
    td005PaidDocumentModeBoundaryPostPatchContainmentAudited:
      cr.td005PaidDocumentModeBoundaryPostPatchContainmentAudited,
    td005PaidDocumentModeBoundaryContainmentClosed: cr.td005PaidDocumentModeBoundaryContainmentClosed,
    td005PaidDocumentModeClientFlagBypassClosed: cr.td005PaidDocumentModeClientFlagBypassClosed,
    td005PaidDocumentModeActualRuntimeImplementationDeferred:
      cr.td005PaidDocumentModeActualRuntimeImplementationDeferred,
    td005PaidDocumentModeStillRequiresActualRuntimeImplementation:
      cr.td005PaidDocumentModeStillRequiresActualRuntimeImplementation,
    td004PreModelPiiRedactionMissing: cr.td004PreModelPiiRedactionMissing,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk:
      cr.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained:
      cr.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign:
      cr.td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign,
    td006EvidenceGateTodoAndOrSemanticsUnresolved: cr.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved:
      cr.td007TrapClaimDispositionNamespaceHardeningUnresolved,
    td008InMemoryRateLimiterServerlessUnsafe: cr.td008InMemoryRateLimiterServerlessUnsafe,
    td010GetUserStateDocumentTypeTodoOpen: cr.td010GetUserStateDocumentTypeTodoOpen,
    td009TmpDebugRunnerDebtClosed: cr.td009TmpDebugRunnerDebtClosed,
    tmpFilesPresentInWorkingTree: cr.tmpFilesPresentInWorkingTree,

    // 8.5W forward readiness gate
    readyForPreModelPiiRedactionPhase: cr.readyForPreModelPiiRedactionPhase,
    readyForEvidenceGatesProductionWiringPhase: cr.readyForEvidenceGatesProductionWiringPhase,
    readyForServerEntitlementVerificationPhase: cr.readyForServerEntitlementVerificationPhase,
    readyForPaidDocumentModeActualRuntimeImplementationPhase:
      cr.readyForPaidDocumentModeActualRuntimeImplementationPhase,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase:
      cr.readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase,
    readyForControlledRealDocumentPilotAuthorizationPhase:
      cr.readyForControlledRealDocumentPilotAuthorizationPhase,
    readyForControlledRealDocumentProductionAuthorizationPhase:
      cr.readyForControlledRealDocumentProductionAuthorizationPhase,
    readyForRealDocumentInput: cr.readyForRealDocumentInput,
    readyForUserVisibleOutput: cr.readyForUserVisibleOutput,
    publicRuntimeEnabled: cr.publicRuntimeEnabled,
    persistenceUsed: cr.persistenceUsed,
    neverUserVisible: cr.neverUserVisible,

    // 8.6A core assertion flags
    paidDocumentModeBoundaryClosureReadyForPiiRedactionPlanning: true,
    preModelPiiRedactionPlanningOnly: true,
    preModelPiiRedactionPlanDefined: true,
    preModelPiiRedactionRuntimeStillNotImplemented: true,
    preModelPiiDetectorRuntimeStillNotImplemented: true,
    preModelPiiMaskingRuntimeStillNotImplemented: true,
    preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: true,
    preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: true,
    preModelPiiRedactionDoesNotAuthorizePromptBuild: true,
    preModelPiiRedactionDoesNotAuthorizeModelCall: true,
    preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: true,

    // Planning confirmations
    piiPlanRequiresBoundaryBeforePromptBuild: true,
    piiPlanRequiresBoundaryBeforeModelCall: true,
    piiPlanRequiresBoundaryBeforeRunSmartTalkDocumentLane: true,
    piiPlanRequiresBoundaryAfterControlledInputValidation: true,
    piiPlanRequiresBoundaryBeforeEvidenceGateEvaluation: true,
    piiPlanDoesNotCreateFreeQaDocumentBypass: true,
    piiPlanDoesNotAuthorizeRealDocumentInput: true,
    piiPlanDoesNotAuthorizeUserVisibleDocumentOutput: true,
    piiPlanDoesNotAuthorizeExactDeadlineCalculation: true,
    piiPlanDoesNotAuthorizePublicRuntime: true,

    // PII class coverage
    piiPlanCoversPersonNames: true,
    piiPlanCoversPostalAddresses: true,
    piiPlanCoversPhoneNumbers: true,
    piiPlanCoversEmailAddresses: true,
    piiPlanCoversDatesOfBirth: true,
    piiPlanCoversCustomerNumbers: true,
    piiPlanCoversInsuranceNumbers: true,
    piiPlanCoversHealthInsuranceIdentifiers: true,
    piiPlanCoversTaxIds: true,
    piiPlanCoversSteuerId: true,
    piiPlanCoversSteuernummer: true,
    piiPlanCoversAktenzeichen: true,
    piiPlanCoversVorgangsnummer: true,
    piiPlanCoversCaseReferenceNumbers: true,
    piiPlanCoversIban: true,
    piiPlanCoversBankAccountIdentifiers: true,
    piiPlanCoversLicensePlateNumbers: true,
    piiPlanCoversEmployerNamesInPersonalContext: true,
    piiPlanCoversSignatures: true,
    piiPlanCoversHandwrittenNames: true,
    piiPlanCoversGreetingsContainingPersonalNames: true,
    piiPlanCoversDocumentRecipientBlocks: true,
    piiPlanCoversSenderBlocks: true,
    piiPlanCoversRealContactDetails: true,
    piiPlanCoversRealAuthorityContactBlocksCopiedFromDocuments: true,
    piiPlanCoversMedicalHealthContextIdentifiers: true,
    piiPlanCoversImmigrationResidencePermitIdentifiers: true,
    piiPlanCoversSocialBenefitIdentifiers: true,
    piiPlanCoversJobcenterBuergergeldIdentifiers: true,
    piiPlanCoversFamilienkasseKindergeldIdentifiers: true,
    piiPlanCoversAuslaenderbehoerdeIdentifiers: true,
    piiPlanCoversFinanzamtIdentifiers: true,

    // Redaction/masking requirements
    piiPlanRequiresDeterministicPlaceholders: true,
    piiPlanRequiresStablePlaceholderMappingInsideOneRequest: true,
    piiPlanRequiresNoRawPiiPersistenceByDefault: true,
    piiPlanRequiresNoRawPiiInPrompt: true,
    piiPlanRequiresNoRawPiiInLogs: true,
    piiPlanRequiresNoRawPiiInAuditTraces: true,
    piiPlanRequiresNoRawPiiInUserVisibleErrorMessages: true,
    piiPlanRequiresNoRawPiiInTelemetry: true,
    piiPlanRequiresNoRawPiiInModelMetadata: true,
    piiPlanRequiresNoRawPiiInEvidenceGateTraces: true,
    piiPlanRequiresNoRawPiiInDeadlineTraces: true,
    piiPlanRequiresRawToPlaceholderMapLocalEphemeralByDefault: true,
    piiPlanRequiresStructuredRedactionAuditWithoutRawValues: true,
    piiPlanRequiresCoverageMetricsWithoutRawValues: true,
    piiPlanRequiresConservativeFallbackWhenConfidenceUncertain: true,
    piiPlanRequiresBlockOrEscalateIfUnsafeToRedact: true,

    // Placeholder plan confirmations
    piiPlanAllowsPersonPlaceholder: true,
    piiPlanAllowsAddressPlaceholder: true,
    piiPlanAllowsPhonePlaceholder: true,
    piiPlanAllowsEmailPlaceholder: true,
    piiPlanAllowsDobPlaceholder: true,
    piiPlanAllowsCustomerIdPlaceholder: true,
    piiPlanAllowsInsuranceIdPlaceholder: true,
    piiPlanAllowsTaxIdPlaceholder: true,
    piiPlanAllowsCaseRefPlaceholder: true,
    piiPlanAllowsIbanPlaceholder: true,
    piiPlanAllowsAuthorityPlaceholder: true,
    piiPlanAllowsEmployerPlaceholder: true,
    piiPlanAllowsSignaturePlaceholder: true,
    piiPlanAllowsDocumentRecipientPlaceholder: true,
    piiPlanAllowsDocumentSenderPlaceholder: true,

    // Safety confirmations
    piiPlanPreservesLegalSemanticStructureWherePossible: true,
    piiPlanMustNotInventMissingFacts: true,
    piiPlanMustNotAlterDatesIntoFalseDeadlines: true,
    piiPlanMarksProtectedIdentifiersInsteadOfSilentDeletion: true,
    piiPlanMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity: true,
    piiPlanMustNotInferRecipientIdentityFromPartialText: true,
    piiPlanMustNotInferSenderIdentityFromPartialText: true,
    piiPlanMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone: true,
    piiPlanRedactionSuccessDoesNotAuthorizeFinalLegalAdvice: true,
    piiPlanRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation: true,
    piiPlanRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer: true,
    piiPlanRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation: true,

    // Failure mode confirmations
    piiPlanDefinesFailurePiiRedactionRequired: true,
    piiPlanDefinesFailurePiiRedactionIncomplete: true,
    piiPlanDefinesFailurePiiRedactionConfidenceLow: true,
    piiPlanDefinesFailurePiiRedactionUnsafeForModel: true,
    piiPlanDefinesFailureBlockedHighRiskIdentifier: true,
    piiPlanDefinesFailureBlockedMedicalIdentifier: true,
    piiPlanDefinesFailureBlockedImmigrationIdentifier: true,
    piiPlanDefinesFailureBlockedFinancialIdentifier: true,
    piiPlanDefinesFailureBlockedUnknownDocumentIdentity: true,

    // Downstream confirmations
    piiPlanRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly: true,
    piiPlanRequiresClaimAuthorizationUseRedactedAnchorsOnly: true,
    piiPlanRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized: true,
    piiPlanRequiresAuditTracesUsePlaceholderCategoriesOnly: true,
    piiPlanRequiresDeadlineLogicStillRequireDeliveryDateEvidence: true,
    piiPlanRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized: true,
    piiPlanRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts: true,

    // 8.6A new actual flags
    actualPiiRedactionPlanOnly: true,
    actualPiiDetectorRuntimeImplemented: false,
    actualPiiMaskingRuntimeImplemented: false,
    actualPiiTextRedacted: false,
    actualRawPiiProcessed: false,
    actualRawPiiPersisted: false,
    actualRawPiiLogged: false,

    // 8.6A no-prohibited-side-effect confirmations
    piiPlanConfirmsNoOpenAiCall: true,
    piiPlanConfirmsNoFetchCall: true,
    piiPlanConfirmsNoProcessEnvRead: true,
    piiPlanConfirmsNoSdkUsage: true,
    piiPlanConfirmsNo8x3AcRerun: true,
    piiPlanConfirmsNoPaymentRuntimeCall: true,
    piiPlanConfirmsNoStripeCall: true,
    piiPlanConfirmsNoCheckoutCall: true,
    piiPlanConfirmsNoEntitlementRuntimeCall: true,
    piiPlanConfirmsNoServerEntitlementVerification: true,
    piiPlanConfirmsNoOcrRuntimeCall: true,
    piiPlanConfirmsNoStorageMutation: true,
    piiPlanConfirmsNoDatabaseWrite: true,
    piiPlanConfirmsNoAuditPersistence: true,
    piiPlanConfirmsNoUserVisibleDocumentExplanation: true,
    piiPlanConfirmsNoEvidenceEvaluation: true,
    piiPlanConfirmsNoClaimAuthorization: true,
    piiPlanConfirmsNoDeadlineCalculation: true,
    piiPlanConfirmsNoLegalCertainty: true,
    piiPlanConfirmsNoPromptBuild: true,
    piiPlanConfirmsNoModelCall: true,
    piiPlanConfirmsNoRunSmartTalkCall: true,
    piiPlanConfirmsNoRouteHandlerCall: true,
    piiPlanConfirmsNoRouteImport: true,
    piiPlanConfirmsNoFilesystemRead: true,
    piiPlanConfirmsNoPhotoRouteModification: true,

    // 8.6A pipeline executed flags
    piiPipelineActuallyExecuted: false,

    // 8.6A runtime authorization flags
    preModelPiiRedactionRuntimeAuthorizedNow: false,

    // 8.6A TD result flags
    td004PreModelPiiRedactionPlanned: true,
    td004PreModelPiiRedactionStillRequiresContract: true,
    td004PreModelPiiRedactionStillRequiresRuntimeImplementation: true,
    td004PreModelPiiRedactionStillMissingInProduction: true,

    // 8.6A forward readiness
    readyFor8x6BPreModelPiiRedactionContract: true,
  };
}

// ── Tamper coverage ───────────────────────────────────────────────────────────

function runTamperCases(): { allRejected: boolean; count: number; failures: string[] } {
  const base = buildCanonical8x6AInput() as unknown as Record<string, unknown>;
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Partial<Record<string, unknown>>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validatePiiRedactionPlanInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.5W prereq gate — core
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.5V" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("prereq_post_patch_audit_ready_for_closure_decision_false",
    { paidDocumentModeBoundaryPostPatchAuditReadyForClosureDecision: false });
  expect_rejected("prereq_closure_decision_not_accepted",
    { controlledRealDocumentPaidDocumentModeBoundaryClosureDecisionAccepted: false });
  expect_rejected("prereq_closure_decision_only_false",
    { paidDocumentModeBoundaryClosureDecisionOnly: false });
  expect_rejected("prereq_boundary_containment_closed_false",
    { paidDocumentModeBoundaryContainmentClosed: false });
  expect_rejected("prereq_boundary_client_flag_bypass_closed_false",
    { paidDocumentModeBoundaryClientFlagBypassClosed: false });
  expect_rejected("prereq_boundary_deny_by_default_closed_false",
    { paidDocumentModeBoundaryDenyByDefaultClosed: false });
  expect_rejected("prereq_boundary_server_entitlement_requirement_preserved_false",
    { paidDocumentModeBoundaryServerEntitlementRequirementPreserved: false });
  expect_rejected("prereq_boundary_actual_runtime_still_deferred_false",
    { paidDocumentModeBoundaryActualRuntimeStillDeferred: false });
  expect_rejected("prereq_paid_document_mode_runtime_still_not_implemented_false",
    { paidDocumentModeRuntimeStillNotImplemented: false });
  expect_rejected("prereq_payment_runtime_still_not_implemented_false",
    { paidDocumentModePaymentRuntimeStillNotImplemented: false });
  expect_rejected("prereq_checkout_runtime_still_not_implemented_false",
    { paidDocumentModeCheckoutRuntimeStillNotImplemented: false });
  expect_rejected("prereq_entitlement_runtime_still_not_implemented_false",
    { paidDocumentModeEntitlementRuntimeStillNotImplemented: false });
  expect_rejected("prereq_server_entitlement_verification_still_not_implemented_false",
    { paidDocumentModeServerEntitlementVerificationStillNotImplemented: false });
  expect_rejected("prereq_document_processing_still_not_authorized_false",
    { paidDocumentModeDocumentProcessingStillNotAuthorized: false });
  expect_rejected("prereq_user_visible_document_explanation_still_not_authorized_false",
    { paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: false });
  expect_rejected("prereq_tamper_cases_rejected_false", { prereqTamperCasesRejected: false });

  // 8.5W closure decision fields
  expect_rejected("prereq_closure_decision_td005_containment_closed_false",
    { closureDecisionTd005ContainmentClosed: false });
  expect_rejected("prereq_closure_decision_td005_client_flag_bypass_closed_false",
    { closureDecisionTd005ClientFlagBypassClosed: false });
  expect_rejected("prereq_closure_decision_td005_boundary_patch_accepted_false",
    { closureDecisionTd005BoundaryPatchAccepted: false });
  expect_rejected("prereq_closure_decision_td005_post_patch_audit_accepted_false",
    { closureDecisionTd005PostPatchAuditAccepted: false });
  expect_rejected("prereq_closure_decision_td005_runtime_implementation_deferred_false",
    { closureDecisionTd005RuntimeImplementationDeferred: false });
  expect_rejected("prereq_closure_decision_does_not_authorize_paid_document_mode_runtime_false",
    { closureDecisionDoesNotAuthorizePaidDocumentModeRuntime: false });
  expect_rejected("prereq_closure_decision_does_not_authorize_payment_runtime_false",
    { closureDecisionDoesNotAuthorizePaymentRuntime: false });
  expect_rejected("prereq_closure_decision_does_not_authorize_checkout_runtime_false",
    { closureDecisionDoesNotAuthorizeCheckoutRuntime: false });
  expect_rejected("prereq_closure_decision_does_not_authorize_entitlement_runtime_false",
    { closureDecisionDoesNotAuthorizeEntitlementRuntime: false });
  expect_rejected("prereq_closure_decision_does_not_authorize_server_entitlement_verification_false",
    { closureDecisionDoesNotAuthorizeServerEntitlementVerification: false });
  expect_rejected("prereq_closure_decision_does_not_authorize_document_processing_false",
    { closureDecisionDoesNotAuthorizeDocumentProcessing: false });
  expect_rejected("prereq_closure_decision_does_not_authorize_ocr_runtime_false",
    { closureDecisionDoesNotAuthorizeOcrRuntime: false });
  expect_rejected("prereq_closure_decision_does_not_authorize_file_runtime_false",
    { closureDecisionDoesNotAuthorizeFileRuntime: false });
  expect_rejected("prereq_closure_decision_does_not_authorize_storage_false",
    { closureDecisionDoesNotAuthorizeStorage: false });
  expect_rejected("prereq_closure_decision_does_not_authorize_persistence_false",
    { closureDecisionDoesNotAuthorizePersistence: false });
  expect_rejected("prereq_closure_decision_does_not_authorize_user_visible_document_output_false",
    { closureDecisionDoesNotAuthorizeUserVisibleDocumentOutput: false });
  expect_rejected("prereq_closure_decision_does_not_authorize_public_runtime_false",
    { closureDecisionDoesNotAuthorizePublicRuntime: false });
  expect_rejected("prereq_closure_decision_does_not_authorize_pilot_runtime_false",
    { closureDecisionDoesNotAuthorizePilotRuntime: false });
  expect_rejected("prereq_closure_decision_does_not_authorize_production_runtime_false",
    { closureDecisionDoesNotAuthorizeProductionRuntime: false });
  expect_rejected("prereq_closure_decision_requires_future_actual_runtime_implementation_false",
    { closureDecisionRequiresFutureActualRuntimeImplementation: false });
  expect_rejected("prereq_closure_decision_requires_future_pre_model_pii_redaction_false",
    { closureDecisionRequiresFuturePreModelPiiRedaction: false });
  expect_rejected("prereq_closure_decision_requires_future_evidence_gates_production_wiring_false",
    { closureDecisionRequiresFutureEvidenceGatesProductionWiring: false });
  expect_rejected("prereq_closure_decision_requires_future_server_entitlement_verification_false",
    { closureDecisionRequiresFutureServerEntitlementVerification: false });
  expect_rejected("prereq_closure_decision_requires_future_user_visible_output_contract_false",
    { closureDecisionRequiresFutureUserVisibleOutputContract: false });
  expect_rejected("prereq_closure_decision_requires_future_pilot_authorization_false",
    { closureDecisionRequiresFuturePilotAuthorization: false });

  // 8.5W containment closure confirmations
  expect_rejected("prereq_containment_closure_8x5u_false", { containmentClosure8x5UDenyBoundaryAccepted: false });
  expect_rejected("prereq_containment_closure_8x5v_false", { containmentClosure8x5VAuditAccepted: false });
  expect_rejected("prereq_containment_closure_smart_talk_route_false", { containmentClosureSmartTalkRouteDenyBoundaryConfirmed: false });
  expect_rejected("prereq_containment_closure_boundary_before_run_smart_talk_false", { containmentClosureBoundaryBeforeRunSmartTalkConfirmed: false });
  expect_rejected("prereq_containment_closure_boundary_after_json_parse_false", { containmentClosureBoundaryAfterJsonParseConfirmed: false });
  expect_rejected("prereq_containment_closure_boundary_after_text_validation_false", { containmentClosureBoundaryAfterTextValidationConfirmed: false });
  expect_rejected("prereq_containment_closure_free_qa_lane_false", { containmentClosureFreeQaLanePreserved: false });
  expect_rejected("prereq_containment_closure_general_questions_false", { containmentClosureGeneralQuestionsPreserved: false });
  expect_rejected("prereq_containment_closure_8x5n_false", { containmentClosure8x5NDocumentBypassGuardPreserved: false });
  expect_rejected("prereq_containment_closure_document_like_text_blocking_false", { containmentClosureDocumentLikeTextBlockingPreserved: false });
  expect_rejected("prereq_containment_closure_8x5h_false", { containmentClosure8x5HPhotoOcrQuarantinePreserved: false });
  expect_rejected("prereq_containment_closure_photo_route_unmodified_false", { containmentClosurePhotoRouteUnmodified: false });
  expect_rejected("prereq_containment_closure_no_photo_runtime_false", { containmentClosureNoPhotoRuntimeEnabled: false });
  expect_rejected("prereq_containment_closure_no_ocr_runtime_false", { containmentClosureNoOcrRuntimeEnabled: false });
  expect_rejected("prereq_containment_closure_no_file_runtime_false", { containmentClosureNoFileRuntimeEnabled: false });
  expect_rejected("prereq_containment_closure_no_storage_false", { containmentClosureNoStorageEnabled: false });
  expect_rejected("prereq_containment_closure_no_persistence_false", { containmentClosureNoPersistenceEnabled: false });
  expect_rejected("prereq_containment_closure_no_public_document_runtime_false", { containmentClosureNoPublicDocumentRuntimeEnabled: false });
  expect_rejected("prereq_containment_closure_client_flags_remain_untrusted_false", { containmentClosureClientFlagsRemainUntrusted: false });
  expect_rejected("prereq_containment_closure_no_entitled_lane_false", { containmentClosureNoEntitledLaneCreated: false });
  expect_rejected("prereq_containment_closure_no_payment_lane_false", { containmentClosureNoPaymentLaneCreated: false });
  expect_rejected("prereq_containment_closure_no_document_processing_lane_false", { containmentClosureNoDocumentProcessingLaneCreated: false });
  expect_rejected("prereq_containment_closure_no_user_visible_document_lane_false", { containmentClosureNoUserVisibleDocumentLaneCreated: false });

  // 8.5W actual flags
  expect_rejected("prereq_actual_closure_decision_only_false", { actualClosureDecisionOnly: false });
  expect_rejected("prereq_actual_live_route_mutation_true", { actualLiveRouteMutationPerformedInThisPhase: true });
  expect_rejected("prereq_actual_smart_talk_route_modified_true", { actualSmartTalkRouteModifiedInThisPhase: true });
  expect_rejected("prereq_actual_photo_route_modified_true", { actualPhotoRouteModifiedInThisPhase: true });
  expect_rejected("prereq_actual_paid_document_boundary_already_implemented_false", { actualPaidDocumentBoundaryAlreadyImplementedBy8x5U: false });
  expect_rejected("prereq_actual_paid_document_boundary_implemented_in_phase_true", { actualPaidDocumentBoundaryImplementedInThisPhase: true });
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
  expect_rejected("prereq_actual_pii_redaction_implemented_true", { actualPiiRedactionImplemented: true });
  expect_rejected("prereq_actual_evidence_gate_runtime_wiring_performed_true", { actualEvidenceGateRuntimeWiringPerformed: true });
  expect_rejected("prereq_actual_claim_authorization_performed_true", { actualClaimAuthorizationPerformed: true });
  expect_rejected("prereq_actual_deadline_calculation_performed_true", { actualDeadlineCalculationPerformed: true });
  expect_rejected("prereq_actual_prompt_build_performed_true", { actualPromptBuildPerformed: true });
  expect_rejected("prereq_actual_model_call_performed_true", { actualModelCallPerformed: true });
  expect_rejected("prereq_actual_run_smart_talk_called_true", { actualRunSmartTalkCalled: true });

  // 8.5W no-prohibited-side-effect confirmations
  expect_rejected("prereq_closure_decision_confirms_no_openai_call_false", { closureDecisionConfirmsNoOpenAiCall: false });
  expect_rejected("prereq_closure_decision_confirms_no_fetch_call_false", { closureDecisionConfirmsNoFetchCall: false });
  expect_rejected("prereq_closure_decision_confirms_no_process_env_read_false", { closureDecisionConfirmsNoProcessEnvRead: false });
  expect_rejected("prereq_closure_decision_confirms_no_sdk_usage_false", { closureDecisionConfirmsNoSdkUsage: false });
  expect_rejected("prereq_closure_decision_confirms_no_8x3ac_rerun_false", { closureDecisionConfirmsNo8x3AcRerun: false });
  expect_rejected("prereq_closure_decision_confirms_no_payment_runtime_call_false", { closureDecisionConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("prereq_closure_decision_confirms_no_stripe_call_false", { closureDecisionConfirmsNoStripeCall: false });
  expect_rejected("prereq_closure_decision_confirms_no_checkout_call_false", { closureDecisionConfirmsNoCheckoutCall: false });
  expect_rejected("prereq_closure_decision_confirms_no_entitlement_runtime_call_false", { closureDecisionConfirmsNoEntitlementRuntimeCall: false });
  expect_rejected("prereq_closure_decision_confirms_no_server_entitlement_verification_false", { closureDecisionConfirmsNoServerEntitlementVerification: false });
  expect_rejected("prereq_closure_decision_confirms_no_ocr_runtime_call_false", { closureDecisionConfirmsNoOcrRuntimeCall: false });
  expect_rejected("prereq_closure_decision_confirms_no_storage_mutation_false", { closureDecisionConfirmsNoStorageMutation: false });
  expect_rejected("prereq_closure_decision_confirms_no_database_write_false", { closureDecisionConfirmsNoDatabaseWrite: false });
  expect_rejected("prereq_closure_decision_confirms_no_audit_persistence_false", { closureDecisionConfirmsNoAuditPersistence: false });
  expect_rejected("prereq_closure_decision_confirms_no_user_visible_document_explanation_false", { closureDecisionConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("prereq_closure_decision_confirms_no_evidence_evaluation_false", { closureDecisionConfirmsNoEvidenceEvaluation: false });
  expect_rejected("prereq_closure_decision_confirms_no_claim_authorization_false", { closureDecisionConfirmsNoClaimAuthorization: false });
  expect_rejected("prereq_closure_decision_confirms_no_deadline_calculation_false", { closureDecisionConfirmsNoDeadlineCalculation: false });
  expect_rejected("prereq_closure_decision_confirms_no_legal_certainty_false", { closureDecisionConfirmsNoLegalCertainty: false });
  expect_rejected("prereq_closure_decision_confirms_no_prompt_build_false", { closureDecisionConfirmsNoPromptBuild: false });
  expect_rejected("prereq_closure_decision_confirms_no_model_call_false", { closureDecisionConfirmsNoModelCall: false });
  expect_rejected("prereq_closure_decision_confirms_no_run_smart_talk_call_false", { closureDecisionConfirmsNoRunSmartTalkCall: false });
  expect_rejected("prereq_closure_decision_confirms_no_route_handler_call_false", { closureDecisionConfirmsNoRouteHandlerCall: false });
  expect_rejected("prereq_closure_decision_confirms_no_route_import_false", { closureDecisionConfirmsNoRouteImport: false });
  expect_rejected("prereq_closure_decision_confirms_no_filesystem_read_false", { closureDecisionConfirmsNoFilesystemRead: false });
  expect_rejected("prereq_closure_decision_confirms_no_photo_route_modification_false", { closureDecisionConfirmsNoPhotoRouteModification: false });

  // Pipeline executed flags (all false in prereq)
  expect_rejected("prereq_execution_sequence_true", { executionSequenceActuallyExecuted: true });
  expect_rejected("prereq_runtime_pipeline_true", { runtimePipelineActuallyExecuted: true });
  expect_rejected("prereq_document_pipeline_true", { documentPipelineActuallyExecuted: true });
  expect_rejected("prereq_payment_pipeline_true", { paymentPipelineActuallyExecuted: true });
  expect_rejected("prereq_entitlement_pipeline_true", { entitlementPipelineActuallyExecuted: true });
  expect_rejected("prereq_checkout_pipeline_true", { checkoutPipelineActuallyExecuted: true });
  expect_rejected("prereq_ocr_pipeline_true", { ocrPipelineActuallyExecuted: true });
  expect_rejected("prereq_user_visible_pipeline_true", { userVisiblePipelineActuallyExecuted: true });

  // Runtime authorization flags (all false)
  expect_rejected("prereq_real_document_input_authorized_true", { realDocumentInputAuthorizedNow: true });
  expect_rejected("prereq_real_document_processing_authorized_true", { realDocumentProcessingAuthorizedNow: true });
  expect_rejected("prereq_real_user_document_upload_authorized_true", { realUserDocumentUploadAuthorizedNow: true });
  expect_rejected("prereq_ocr_runtime_authorized_true", { ocrRuntimeAuthorizedNow: true });
  expect_rejected("prereq_photo_input_authorized_true", { photoInputAuthorizedNow: true });
  expect_rejected("prereq_file_input_authorized_true", { fileInputAuthorizedNow: true });
  expect_rejected("prereq_document_storage_authorized_true", { documentStorageAuthorizedNow: true });
  expect_rejected("prereq_persistence_authorized_true", { persistenceAuthorizedNow: true });
  expect_rejected("prereq_public_runtime_authorized_true", { publicRuntimeAuthorizedNow: true });
  expect_rejected("prereq_user_visible_legal_deadline_output_authorized_true", { userVisibleLegalDeadlineOutputAuthorizedNow: true });
  expect_rejected("prereq_live_llm_runtime_authorized_true", { liveLLMRuntimeAuthorizedNow: true });
  expect_rejected("prereq_connected_ai_runtime_authorized_true", { connectedAiRuntimeAuthorizedNow: true });
  expect_rejected("prereq_pilot_runtime_authorized_true", { pilotRuntimeAuthorizedNow: true });
  expect_rejected("prereq_production_runtime_authorized_true", { productionRuntimeAuthorizedNow: true });
  expect_rejected("prereq_paid_document_mode_runtime_authorized_true", { paidDocumentModeRuntimeAuthorizedNow: true });
  expect_rejected("prereq_payment_runtime_authorized_true", { paymentRuntimeAuthorizedNow: true });
  expect_rejected("prereq_entitlement_runtime_authorized_true", { entitlementRuntimeAuthorizedNow: true });
  expect_rejected("prereq_checkout_runtime_authorized_true", { checkoutRuntimeAuthorizedNow: true });

  // Authorization grants (all false)
  expect_rejected("prereq_runtime_authorization_granted_true", { runtimeAuthorizationGranted: true });
  expect_rejected("prereq_pilot_authorization_granted_true", { pilotAuthorizationGranted: true });
  expect_rejected("prereq_production_authorization_granted_true", { productionAuthorizationGranted: true });
  expect_rejected("prereq_final_authorization_granted_true", { finalAuthorizationGranted: true });
  expect_rejected("prereq_go_live_authorization_granted_true", { goLiveAuthorizationGranted: true });

  // Legal safety flags
  expect_rejected("prereq_exact_deadline_calculation_authorized_true", { exactDeadlineCalculationAuthorized: true });
  expect_rejected("prereq_delivery_date_invention_authorized_true", { deliveryDateInventionAuthorized: true });
  expect_rejected("prereq_final_date_invention_authorized_true", { finalDateInventionAuthorized: true });
  expect_rejected("prereq_legal_certainty_authorized_true", { legalCertaintyAuthorized: true });
  expect_rejected("prereq_coercive_legal_instruction_authorized_true", { coerciveLegalInstructionAuthorized: true });
  expect_rejected("prereq_delivery_date_required_for_exact_deadline_false", { deliveryDateRequiredForExactDeadline: false });

  // TD flags
  expect_rejected("prereq_td001_false", { td001DocumentBypassGuardContainmentClosed: false });
  expect_rejected("prereq_td005_surgical_route_patch_performed_false", { td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed: false });
  expect_rejected("prereq_td005_post_patch_containment_audited_false", { td005PaidDocumentModeBoundaryPostPatchContainmentAudited: false });
  expect_rejected("prereq_td005_boundary_containment_closed_false", { td005PaidDocumentModeBoundaryContainmentClosed: false });
  expect_rejected("prereq_td005_client_flag_bypass_closed_false", { td005PaidDocumentModeClientFlagBypassClosed: false });
  expect_rejected("prereq_td005_actual_runtime_implementation_deferred_false", { td005PaidDocumentModeActualRuntimeImplementationDeferred: false });
  expect_rejected("prereq_td005_still_requires_actual_runtime_implementation_false", { td005PaidDocumentModeStillRequiresActualRuntimeImplementation: false });
  expect_rejected("prereq_td004_pre_model_pii_redaction_missing_false", { td004PreModelPiiRedactionMissing: false });
  expect_rejected("prereq_td002_false", { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false });
  expect_rejected("prereq_td003_contained_false", { td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: false });
  expect_rejected("prereq_td003_still_requires_future_authorized_runtime_design_false", { td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: false });
  expect_rejected("prereq_td006_false", { td006EvidenceGateTodoAndOrSemanticsUnresolved: false });
  expect_rejected("prereq_td007_false", { td007TrapClaimDispositionNamespaceHardeningUnresolved: false });
  expect_rejected("prereq_td008_false", { td008InMemoryRateLimiterServerlessUnsafe: false });
  expect_rejected("prereq_td010_false", { td010GetUserStateDocumentTypeTodoOpen: false });
  expect_rejected("prereq_td009_false", { td009TmpDebugRunnerDebtClosed: false });
  expect_rejected("prereq_tmp_files_present_true", { tmpFilesPresentInWorkingTree: true });

  // 8.5W forward readiness gate
  expect_rejected("prereq_ready_for_pre_model_pii_redaction_phase_false", { readyForPreModelPiiRedactionPhase: false });
  expect_rejected("prereq_ready_for_evidence_gates_production_wiring_phase_true", { readyForEvidenceGatesProductionWiringPhase: true });
  expect_rejected("prereq_ready_for_server_entitlement_verification_phase_true", { readyForServerEntitlementVerificationPhase: true });
  expect_rejected("prereq_ready_for_paid_document_mode_actual_runtime_implementation_phase_true", { readyForPaidDocumentModeActualRuntimeImplementationPhase: true });
  expect_rejected("prereq_ready_for_separate_runtime_authorization_true", { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true });
  expect_rejected("prereq_ready_for_pilot_authorization_true", { readyForControlledRealDocumentPilotAuthorizationPhase: true });
  expect_rejected("prereq_ready_for_production_authorization_true", { readyForControlledRealDocumentProductionAuthorizationPhase: true });
  expect_rejected("prereq_ready_for_real_document_input_true", { readyForRealDocumentInput: true });
  expect_rejected("prereq_ready_for_user_visible_output_true", { readyForUserVisibleOutput: true });
  expect_rejected("prereq_public_runtime_enabled_true", { publicRuntimeEnabled: true });
  expect_rejected("prereq_persistence_used_true", { persistenceUsed: true });
  expect_rejected("prereq_never_user_visible_false", { neverUserVisible: false });

  // 8.6A core assertion flags
  expect_rejected("boundary_closure_ready_for_pii_redaction_planning_false",
    { paidDocumentModeBoundaryClosureReadyForPiiRedactionPlanning: false });
  expect_rejected("pre_model_pii_redaction_planning_only_false",
    { preModelPiiRedactionPlanningOnly: false });
  expect_rejected("pre_model_pii_redaction_plan_defined_false",
    { preModelPiiRedactionPlanDefined: false });
  expect_rejected("pre_model_pii_redaction_runtime_still_not_implemented_false",
    { preModelPiiRedactionRuntimeStillNotImplemented: false });
  expect_rejected("pre_model_pii_detector_runtime_still_not_implemented_false",
    { preModelPiiDetectorRuntimeStillNotImplemented: false });
  expect_rejected("pre_model_pii_masking_runtime_still_not_implemented_false",
    { preModelPiiMaskingRuntimeStillNotImplemented: false });
  expect_rejected("pre_model_pii_redaction_does_not_authorize_real_document_input_false",
    { preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: false });
  expect_rejected("pre_model_pii_redaction_does_not_authorize_user_visible_output_false",
    { preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: false });
  expect_rejected("pre_model_pii_redaction_does_not_authorize_prompt_build_false",
    { preModelPiiRedactionDoesNotAuthorizePromptBuild: false });
  expect_rejected("pre_model_pii_redaction_does_not_authorize_model_call_false",
    { preModelPiiRedactionDoesNotAuthorizeModelCall: false });
  expect_rejected("pre_model_pii_redaction_does_not_authorize_run_smart_talk_false",
    { preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: false });

  // Planning confirmations
  expect_rejected("pii_plan_requires_boundary_before_prompt_build_false",
    { piiPlanRequiresBoundaryBeforePromptBuild: false });
  expect_rejected("pii_plan_requires_boundary_before_model_call_false",
    { piiPlanRequiresBoundaryBeforeModelCall: false });
  expect_rejected("pii_plan_requires_boundary_before_run_smart_talk_document_lane_false",
    { piiPlanRequiresBoundaryBeforeRunSmartTalkDocumentLane: false });
  expect_rejected("pii_plan_requires_boundary_after_controlled_input_validation_false",
    { piiPlanRequiresBoundaryAfterControlledInputValidation: false });
  expect_rejected("pii_plan_requires_boundary_before_evidence_gate_evaluation_false",
    { piiPlanRequiresBoundaryBeforeEvidenceGateEvaluation: false });
  expect_rejected("pii_plan_does_not_create_free_qa_document_bypass_false",
    { piiPlanDoesNotCreateFreeQaDocumentBypass: false });
  expect_rejected("pii_plan_does_not_authorize_real_document_input_false",
    { piiPlanDoesNotAuthorizeRealDocumentInput: false });
  expect_rejected("pii_plan_does_not_authorize_user_visible_document_output_false",
    { piiPlanDoesNotAuthorizeUserVisibleDocumentOutput: false });
  expect_rejected("pii_plan_does_not_authorize_exact_deadline_calculation_false",
    { piiPlanDoesNotAuthorizeExactDeadlineCalculation: false });
  expect_rejected("pii_plan_does_not_authorize_public_runtime_false",
    { piiPlanDoesNotAuthorizePublicRuntime: false });

  // PII class coverage (32)
  expect_rejected("pii_plan_covers_person_names_false", { piiPlanCoversPersonNames: false });
  expect_rejected("pii_plan_covers_postal_addresses_false", { piiPlanCoversPostalAddresses: false });
  expect_rejected("pii_plan_covers_phone_numbers_false", { piiPlanCoversPhoneNumbers: false });
  expect_rejected("pii_plan_covers_email_addresses_false", { piiPlanCoversEmailAddresses: false });
  expect_rejected("pii_plan_covers_dates_of_birth_false", { piiPlanCoversDatesOfBirth: false });
  expect_rejected("pii_plan_covers_customer_numbers_false", { piiPlanCoversCustomerNumbers: false });
  expect_rejected("pii_plan_covers_insurance_numbers_false", { piiPlanCoversInsuranceNumbers: false });
  expect_rejected("pii_plan_covers_health_insurance_identifiers_false", { piiPlanCoversHealthInsuranceIdentifiers: false });
  expect_rejected("pii_plan_covers_tax_ids_false", { piiPlanCoversTaxIds: false });
  expect_rejected("pii_plan_covers_steuer_id_false", { piiPlanCoversSteuerId: false });
  expect_rejected("pii_plan_covers_steuernummer_false", { piiPlanCoversSteuernummer: false });
  expect_rejected("pii_plan_covers_aktenzeichen_false", { piiPlanCoversAktenzeichen: false });
  expect_rejected("pii_plan_covers_vorgangsnummer_false", { piiPlanCoversVorgangsnummer: false });
  expect_rejected("pii_plan_covers_case_reference_numbers_false", { piiPlanCoversCaseReferenceNumbers: false });
  expect_rejected("pii_plan_covers_iban_false", { piiPlanCoversIban: false });
  expect_rejected("pii_plan_covers_bank_account_identifiers_false", { piiPlanCoversBankAccountIdentifiers: false });
  expect_rejected("pii_plan_covers_license_plate_numbers_false", { piiPlanCoversLicensePlateNumbers: false });
  expect_rejected("pii_plan_covers_employer_names_in_personal_context_false", { piiPlanCoversEmployerNamesInPersonalContext: false });
  expect_rejected("pii_plan_covers_signatures_false", { piiPlanCoversSignatures: false });
  expect_rejected("pii_plan_covers_handwritten_names_false", { piiPlanCoversHandwrittenNames: false });
  expect_rejected("pii_plan_covers_greetings_containing_personal_names_false", { piiPlanCoversGreetingsContainingPersonalNames: false });
  expect_rejected("pii_plan_covers_document_recipient_blocks_false", { piiPlanCoversDocumentRecipientBlocks: false });
  expect_rejected("pii_plan_covers_sender_blocks_false", { piiPlanCoversSenderBlocks: false });
  expect_rejected("pii_plan_covers_real_contact_details_false", { piiPlanCoversRealContactDetails: false });
  expect_rejected("pii_plan_covers_real_authority_contact_blocks_false", { piiPlanCoversRealAuthorityContactBlocksCopiedFromDocuments: false });
  expect_rejected("pii_plan_covers_medical_health_context_identifiers_false", { piiPlanCoversMedicalHealthContextIdentifiers: false });
  expect_rejected("pii_plan_covers_immigration_residence_permit_identifiers_false", { piiPlanCoversImmigrationResidencePermitIdentifiers: false });
  expect_rejected("pii_plan_covers_social_benefit_identifiers_false", { piiPlanCoversSocialBenefitIdentifiers: false });
  expect_rejected("pii_plan_covers_jobcenter_buergergeld_identifiers_false", { piiPlanCoversJobcenterBuergergeldIdentifiers: false });
  expect_rejected("pii_plan_covers_familienkasse_kindergeld_identifiers_false", { piiPlanCoversFamilienkasseKindergeldIdentifiers: false });
  expect_rejected("pii_plan_covers_auslaenderbehoerde_identifiers_false", { piiPlanCoversAuslaenderbehoerdeIdentifiers: false });
  expect_rejected("pii_plan_covers_finanzamt_identifiers_false", { piiPlanCoversFinanzamtIdentifiers: false });

  // Redaction/masking requirements (16)
  expect_rejected("pii_plan_requires_deterministic_placeholders_false", { piiPlanRequiresDeterministicPlaceholders: false });
  expect_rejected("pii_plan_requires_stable_placeholder_mapping_false", { piiPlanRequiresStablePlaceholderMappingInsideOneRequest: false });
  expect_rejected("pii_plan_requires_no_raw_pii_persistence_false", { piiPlanRequiresNoRawPiiPersistenceByDefault: false });
  expect_rejected("pii_plan_requires_no_raw_pii_in_prompt_false", { piiPlanRequiresNoRawPiiInPrompt: false });
  expect_rejected("pii_plan_requires_no_raw_pii_in_logs_false", { piiPlanRequiresNoRawPiiInLogs: false });
  expect_rejected("pii_plan_requires_no_raw_pii_in_audit_traces_false", { piiPlanRequiresNoRawPiiInAuditTraces: false });
  expect_rejected("pii_plan_requires_no_raw_pii_in_user_visible_error_messages_false", { piiPlanRequiresNoRawPiiInUserVisibleErrorMessages: false });
  expect_rejected("pii_plan_requires_no_raw_pii_in_telemetry_false", { piiPlanRequiresNoRawPiiInTelemetry: false });
  expect_rejected("pii_plan_requires_no_raw_pii_in_model_metadata_false", { piiPlanRequiresNoRawPiiInModelMetadata: false });
  expect_rejected("pii_plan_requires_no_raw_pii_in_evidence_gate_traces_false", { piiPlanRequiresNoRawPiiInEvidenceGateTraces: false });
  expect_rejected("pii_plan_requires_no_raw_pii_in_deadline_traces_false", { piiPlanRequiresNoRawPiiInDeadlineTraces: false });
  expect_rejected("pii_plan_requires_raw_to_placeholder_map_local_ephemeral_false", { piiPlanRequiresRawToPlaceholderMapLocalEphemeralByDefault: false });
  expect_rejected("pii_plan_requires_structured_redaction_audit_false", { piiPlanRequiresStructuredRedactionAuditWithoutRawValues: false });
  expect_rejected("pii_plan_requires_coverage_metrics_without_raw_values_false", { piiPlanRequiresCoverageMetricsWithoutRawValues: false });
  expect_rejected("pii_plan_requires_conservative_fallback_false", { piiPlanRequiresConservativeFallbackWhenConfidenceUncertain: false });
  expect_rejected("pii_plan_requires_block_or_escalate_if_unsafe_false", { piiPlanRequiresBlockOrEscalateIfUnsafeToRedact: false });

  // Placeholder plan confirmations (15)
  expect_rejected("pii_plan_allows_person_placeholder_false", { piiPlanAllowsPersonPlaceholder: false });
  expect_rejected("pii_plan_allows_address_placeholder_false", { piiPlanAllowsAddressPlaceholder: false });
  expect_rejected("pii_plan_allows_phone_placeholder_false", { piiPlanAllowsPhonePlaceholder: false });
  expect_rejected("pii_plan_allows_email_placeholder_false", { piiPlanAllowsEmailPlaceholder: false });
  expect_rejected("pii_plan_allows_dob_placeholder_false", { piiPlanAllowsDobPlaceholder: false });
  expect_rejected("pii_plan_allows_customer_id_placeholder_false", { piiPlanAllowsCustomerIdPlaceholder: false });
  expect_rejected("pii_plan_allows_insurance_id_placeholder_false", { piiPlanAllowsInsuranceIdPlaceholder: false });
  expect_rejected("pii_plan_allows_tax_id_placeholder_false", { piiPlanAllowsTaxIdPlaceholder: false });
  expect_rejected("pii_plan_allows_case_ref_placeholder_false", { piiPlanAllowsCaseRefPlaceholder: false });
  expect_rejected("pii_plan_allows_iban_placeholder_false", { piiPlanAllowsIbanPlaceholder: false });
  expect_rejected("pii_plan_allows_authority_placeholder_false", { piiPlanAllowsAuthorityPlaceholder: false });
  expect_rejected("pii_plan_allows_employer_placeholder_false", { piiPlanAllowsEmployerPlaceholder: false });
  expect_rejected("pii_plan_allows_signature_placeholder_false", { piiPlanAllowsSignaturePlaceholder: false });
  expect_rejected("pii_plan_allows_document_recipient_placeholder_false", { piiPlanAllowsDocumentRecipientPlaceholder: false });
  expect_rejected("pii_plan_allows_document_sender_placeholder_false", { piiPlanAllowsDocumentSenderPlaceholder: false });

  // Safety confirmations (12)
  expect_rejected("pii_plan_preserves_legal_semantic_structure_false", { piiPlanPreservesLegalSemanticStructureWherePossible: false });
  expect_rejected("pii_plan_must_not_invent_missing_facts_false", { piiPlanMustNotInventMissingFacts: false });
  expect_rejected("pii_plan_must_not_alter_dates_into_false_deadlines_false", { piiPlanMustNotAlterDatesIntoFalseDeadlines: false });
  expect_rejected("pii_plan_marks_protected_identifiers_instead_of_silent_deletion_false", { piiPlanMarksProtectedIdentifiersInsteadOfSilentDeletion: false });
  expect_rejected("pii_plan_must_not_convert_unknown_authority_text_false", { piiPlanMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity: false });
  expect_rejected("pii_plan_must_not_infer_recipient_identity_false", { piiPlanMustNotInferRecipientIdentityFromPartialText: false });
  expect_rejected("pii_plan_must_not_infer_sender_identity_false", { piiPlanMustNotInferSenderIdentityFromPartialText: false });
  expect_rejected("pii_plan_must_not_classify_document_as_legally_sufficient_false", { piiPlanMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone: false });
  expect_rejected("pii_plan_redaction_success_does_not_authorize_final_legal_advice_false", { piiPlanRedactionSuccessDoesNotAuthorizeFinalLegalAdvice: false });
  expect_rejected("pii_plan_redaction_success_does_not_authorize_exact_deadline_calculation_false", { piiPlanRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation: false });
  expect_rejected("pii_plan_redaction_success_does_not_authorize_user_visible_document_answer_false", { piiPlanRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer: false });
  expect_rejected("pii_plan_redaction_success_only_unlocks_possible_later_evidence_gate_evaluation_false", { piiPlanRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation: false });

  // Failure mode confirmations (9)
  expect_rejected("pii_plan_defines_failure_pii_redaction_required_false", { piiPlanDefinesFailurePiiRedactionRequired: false });
  expect_rejected("pii_plan_defines_failure_pii_redaction_incomplete_false", { piiPlanDefinesFailurePiiRedactionIncomplete: false });
  expect_rejected("pii_plan_defines_failure_pii_redaction_confidence_low_false", { piiPlanDefinesFailurePiiRedactionConfidenceLow: false });
  expect_rejected("pii_plan_defines_failure_pii_redaction_unsafe_for_model_false", { piiPlanDefinesFailurePiiRedactionUnsafeForModel: false });
  expect_rejected("pii_plan_defines_failure_blocked_high_risk_identifier_false", { piiPlanDefinesFailureBlockedHighRiskIdentifier: false });
  expect_rejected("pii_plan_defines_failure_blocked_medical_identifier_false", { piiPlanDefinesFailureBlockedMedicalIdentifier: false });
  expect_rejected("pii_plan_defines_failure_blocked_immigration_identifier_false", { piiPlanDefinesFailureBlockedImmigrationIdentifier: false });
  expect_rejected("pii_plan_defines_failure_blocked_financial_identifier_false", { piiPlanDefinesFailureBlockedFinancialIdentifier: false });
  expect_rejected("pii_plan_defines_failure_blocked_unknown_document_identity_false", { piiPlanDefinesFailureBlockedUnknownDocumentIdentity: false });

  // Downstream confirmations (7)
  expect_rejected("pii_plan_requires_evidence_gates_consume_redacted_false", { piiPlanRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly: false });
  expect_rejected("pii_plan_requires_claim_authorization_use_redacted_anchors_false", { piiPlanRequiresClaimAuthorizationUseRedactedAnchorsOnly: false });
  expect_rejected("pii_plan_requires_user_visible_output_not_reveal_raw_pii_false", { piiPlanRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized: false });
  expect_rejected("pii_plan_requires_audit_traces_use_placeholder_categories_false", { piiPlanRequiresAuditTracesUsePlaceholderCategoriesOnly: false });
  expect_rejected("pii_plan_requires_deadline_logic_still_require_delivery_date_evidence_false", { piiPlanRequiresDeadlineLogicStillRequireDeliveryDateEvidence: false });
  expect_rejected("pii_plan_requires_storage_persistence_remain_blocked_false", { piiPlanRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized: false });
  expect_rejected("pii_plan_requires_paid_document_runtime_remain_blocked_false", { piiPlanRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts: false });

  // 8.6A new actual flags
  expect_rejected("actual_pii_redaction_plan_only_false", { actualPiiRedactionPlanOnly: false });
  expect_rejected("actual_pii_detector_runtime_implemented_true", { actualPiiDetectorRuntimeImplemented: true });
  expect_rejected("actual_pii_masking_runtime_implemented_true", { actualPiiMaskingRuntimeImplemented: true });
  expect_rejected("actual_pii_text_redacted_true", { actualPiiTextRedacted: true });
  expect_rejected("actual_raw_pii_processed_true", { actualRawPiiProcessed: true });
  expect_rejected("actual_raw_pii_persisted_true", { actualRawPiiPersisted: true });
  expect_rejected("actual_raw_pii_logged_true", { actualRawPiiLogged: true });

  // 8.6A no-prohibited-side-effect confirmations (26)
  expect_rejected("pii_plan_confirms_no_openai_call_false", { piiPlanConfirmsNoOpenAiCall: false });
  expect_rejected("pii_plan_confirms_no_fetch_call_false", { piiPlanConfirmsNoFetchCall: false });
  expect_rejected("pii_plan_confirms_no_process_env_read_false", { piiPlanConfirmsNoProcessEnvRead: false });
  expect_rejected("pii_plan_confirms_no_sdk_usage_false", { piiPlanConfirmsNoSdkUsage: false });
  expect_rejected("pii_plan_confirms_no_8x3ac_rerun_false", { piiPlanConfirmsNo8x3AcRerun: false });
  expect_rejected("pii_plan_confirms_no_payment_runtime_call_false", { piiPlanConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("pii_plan_confirms_no_stripe_call_false", { piiPlanConfirmsNoStripeCall: false });
  expect_rejected("pii_plan_confirms_no_checkout_call_false", { piiPlanConfirmsNoCheckoutCall: false });
  expect_rejected("pii_plan_confirms_no_entitlement_runtime_call_false", { piiPlanConfirmsNoEntitlementRuntimeCall: false });
  expect_rejected("pii_plan_confirms_no_server_entitlement_verification_false", { piiPlanConfirmsNoServerEntitlementVerification: false });
  expect_rejected("pii_plan_confirms_no_ocr_runtime_call_false", { piiPlanConfirmsNoOcrRuntimeCall: false });
  expect_rejected("pii_plan_confirms_no_storage_mutation_false", { piiPlanConfirmsNoStorageMutation: false });
  expect_rejected("pii_plan_confirms_no_database_write_false", { piiPlanConfirmsNoDatabaseWrite: false });
  expect_rejected("pii_plan_confirms_no_audit_persistence_false", { piiPlanConfirmsNoAuditPersistence: false });
  expect_rejected("pii_plan_confirms_no_user_visible_document_explanation_false", { piiPlanConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("pii_plan_confirms_no_evidence_evaluation_false", { piiPlanConfirmsNoEvidenceEvaluation: false });
  expect_rejected("pii_plan_confirms_no_claim_authorization_false", { piiPlanConfirmsNoClaimAuthorization: false });
  expect_rejected("pii_plan_confirms_no_deadline_calculation_false", { piiPlanConfirmsNoDeadlineCalculation: false });
  expect_rejected("pii_plan_confirms_no_legal_certainty_false", { piiPlanConfirmsNoLegalCertainty: false });
  expect_rejected("pii_plan_confirms_no_prompt_build_false", { piiPlanConfirmsNoPromptBuild: false });
  expect_rejected("pii_plan_confirms_no_model_call_false", { piiPlanConfirmsNoModelCall: false });
  expect_rejected("pii_plan_confirms_no_run_smart_talk_call_false", { piiPlanConfirmsNoRunSmartTalkCall: false });
  expect_rejected("pii_plan_confirms_no_route_handler_call_false", { piiPlanConfirmsNoRouteHandlerCall: false });
  expect_rejected("pii_plan_confirms_no_route_import_false", { piiPlanConfirmsNoRouteImport: false });
  expect_rejected("pii_plan_confirms_no_filesystem_read_false", { piiPlanConfirmsNoFilesystemRead: false });
  expect_rejected("pii_plan_confirms_no_photo_route_modification_false", { piiPlanConfirmsNoPhotoRouteModification: false });

  // 8.6A pipeline (new)
  expect_rejected("pii_pipeline_actually_executed_true", { piiPipelineActuallyExecuted: true });

  // 8.6A runtime authorization (new)
  expect_rejected("pre_model_pii_redaction_runtime_authorized_now_true", { preModelPiiRedactionRuntimeAuthorizedNow: true });

  // 8.6A TD result flags
  expect_rejected("td004_pre_model_pii_redaction_planned_false", { td004PreModelPiiRedactionPlanned: false });
  expect_rejected("td004_pre_model_pii_redaction_still_requires_contract_false", { td004PreModelPiiRedactionStillRequiresContract: false });
  expect_rejected("td004_pre_model_pii_redaction_still_requires_runtime_implementation_false", { td004PreModelPiiRedactionStillRequiresRuntimeImplementation: false });
  expect_rejected("td004_pre_model_pii_redaction_still_missing_in_production_false", { td004PreModelPiiRedactionStillMissingInProduction: false });

  // 8.6A forward readiness
  expect_rejected("ready_for_8x6b_pre_model_pii_redaction_contract_false",
    { readyFor8x6BPreModelPiiRedactionContract: false });
  expect_rejected("ready_for_evidence_gates_production_wiring_phase_true",
    { readyForEvidenceGatesProductionWiringPhase: true });
  expect_rejected("ready_for_server_entitlement_verification_phase_true",
    { readyForServerEntitlementVerificationPhase: true });
  expect_rejected("ready_for_paid_document_mode_actual_runtime_implementation_phase_true",
    { readyForPaidDocumentModeActualRuntimeImplementationPhase: true });
  expect_rejected("ready_for_separate_runtime_authorization_true",
    { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true });
  expect_rejected("ready_for_real_document_input_true", { readyForRealDocumentInput: true });
  expect_rejected("ready_for_user_visible_output_true", { readyForUserVisibleOutput: true });
  expect_rejected("public_runtime_enabled_true", { publicRuntimeEnabled: true });
  expect_rejected("persistence_used_true", { persistenceUsed: true });
  expect_rejected("never_user_visible_false", { neverUserVisible: false });

  return { allRejected: failures.length === 0, count, failures };
}

// ── Public export ─────────────────────────────────────────────────────────────

export function runControlledRealDocumentPreModelPiiRedactionPlan(): ControlledRealDocumentPreModelPiiRedactionPlanResult {
  const canonical = buildCanonical8x6AInput();
  const canonicalAsRecord = canonical as unknown as Record<string, unknown>;
  const validation = validatePiiRedactionPlanInput(canonicalAsRecord);
  const tamperResult = runTamperCases();
  const allPassed = validation.accepted && tamperResult.allRejected;

  return {
    checkId: "8.6A",
    allPassed,
    paidDocumentModeBoundaryClosureReadyForPiiRedactionPlanning: true,
    controlledRealDocumentPreModelPiiRedactionPlanAccepted: allPassed,
    preModelPiiRedactionPlanningOnly: true,
    preModelPiiRedactionPlanDefined: true,
    preModelPiiRedactionRuntimeStillNotImplemented: true,
    preModelPiiDetectorRuntimeStillNotImplemented: true,
    preModelPiiMaskingRuntimeStillNotImplemented: true,
    preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: true,
    preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: true,
    preModelPiiRedactionDoesNotAuthorizePromptBuild: true,
    preModelPiiRedactionDoesNotAuthorizeModelCall: true,
    preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: true,
    tamperCasesRejected: tamperResult.allRejected,

    piiPlanRequiresBoundaryBeforePromptBuild: true,
    piiPlanRequiresBoundaryBeforeModelCall: true,
    piiPlanRequiresBoundaryBeforeRunSmartTalkDocumentLane: true,
    piiPlanRequiresBoundaryAfterControlledInputValidation: true,
    piiPlanRequiresBoundaryBeforeEvidenceGateEvaluation: true,
    piiPlanDoesNotCreateFreeQaDocumentBypass: true,
    piiPlanDoesNotAuthorizeRealDocumentInput: true,
    piiPlanDoesNotAuthorizeUserVisibleDocumentOutput: true,
    piiPlanDoesNotAuthorizeExactDeadlineCalculation: true,
    piiPlanDoesNotAuthorizePublicRuntime: true,

    piiPlanCoversPersonNames: true,
    piiPlanCoversPostalAddresses: true,
    piiPlanCoversPhoneNumbers: true,
    piiPlanCoversEmailAddresses: true,
    piiPlanCoversDatesOfBirth: true,
    piiPlanCoversCustomerNumbers: true,
    piiPlanCoversInsuranceNumbers: true,
    piiPlanCoversHealthInsuranceIdentifiers: true,
    piiPlanCoversTaxIds: true,
    piiPlanCoversSteuerId: true,
    piiPlanCoversSteuernummer: true,
    piiPlanCoversAktenzeichen: true,
    piiPlanCoversVorgangsnummer: true,
    piiPlanCoversCaseReferenceNumbers: true,
    piiPlanCoversIban: true,
    piiPlanCoversBankAccountIdentifiers: true,
    piiPlanCoversLicensePlateNumbers: true,
    piiPlanCoversEmployerNamesInPersonalContext: true,
    piiPlanCoversSignatures: true,
    piiPlanCoversHandwrittenNames: true,
    piiPlanCoversGreetingsContainingPersonalNames: true,
    piiPlanCoversDocumentRecipientBlocks: true,
    piiPlanCoversSenderBlocks: true,
    piiPlanCoversRealContactDetails: true,
    piiPlanCoversRealAuthorityContactBlocksCopiedFromDocuments: true,
    piiPlanCoversMedicalHealthContextIdentifiers: true,
    piiPlanCoversImmigrationResidencePermitIdentifiers: true,
    piiPlanCoversSocialBenefitIdentifiers: true,
    piiPlanCoversJobcenterBuergergeldIdentifiers: true,
    piiPlanCoversFamilienkasseKindergeldIdentifiers: true,
    piiPlanCoversAuslaenderbehoerdeIdentifiers: true,
    piiPlanCoversFinanzamtIdentifiers: true,

    piiPlanRequiresDeterministicPlaceholders: true,
    piiPlanRequiresStablePlaceholderMappingInsideOneRequest: true,
    piiPlanRequiresNoRawPiiPersistenceByDefault: true,
    piiPlanRequiresNoRawPiiInPrompt: true,
    piiPlanRequiresNoRawPiiInLogs: true,
    piiPlanRequiresNoRawPiiInAuditTraces: true,
    piiPlanRequiresNoRawPiiInUserVisibleErrorMessages: true,
    piiPlanRequiresNoRawPiiInTelemetry: true,
    piiPlanRequiresNoRawPiiInModelMetadata: true,
    piiPlanRequiresNoRawPiiInEvidenceGateTraces: true,
    piiPlanRequiresNoRawPiiInDeadlineTraces: true,
    piiPlanRequiresRawToPlaceholderMapLocalEphemeralByDefault: true,
    piiPlanRequiresStructuredRedactionAuditWithoutRawValues: true,
    piiPlanRequiresCoverageMetricsWithoutRawValues: true,
    piiPlanRequiresConservativeFallbackWhenConfidenceUncertain: true,
    piiPlanRequiresBlockOrEscalateIfUnsafeToRedact: true,

    piiPlanAllowsPersonPlaceholder: true,
    piiPlanAllowsAddressPlaceholder: true,
    piiPlanAllowsPhonePlaceholder: true,
    piiPlanAllowsEmailPlaceholder: true,
    piiPlanAllowsDobPlaceholder: true,
    piiPlanAllowsCustomerIdPlaceholder: true,
    piiPlanAllowsInsuranceIdPlaceholder: true,
    piiPlanAllowsTaxIdPlaceholder: true,
    piiPlanAllowsCaseRefPlaceholder: true,
    piiPlanAllowsIbanPlaceholder: true,
    piiPlanAllowsAuthorityPlaceholder: true,
    piiPlanAllowsEmployerPlaceholder: true,
    piiPlanAllowsSignaturePlaceholder: true,
    piiPlanAllowsDocumentRecipientPlaceholder: true,
    piiPlanAllowsDocumentSenderPlaceholder: true,

    piiPlanPreservesLegalSemanticStructureWherePossible: true,
    piiPlanMustNotInventMissingFacts: true,
    piiPlanMustNotAlterDatesIntoFalseDeadlines: true,
    piiPlanMarksProtectedIdentifiersInsteadOfSilentDeletion: true,
    piiPlanMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity: true,
    piiPlanMustNotInferRecipientIdentityFromPartialText: true,
    piiPlanMustNotInferSenderIdentityFromPartialText: true,
    piiPlanMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone: true,
    piiPlanRedactionSuccessDoesNotAuthorizeFinalLegalAdvice: true,
    piiPlanRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation: true,
    piiPlanRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer: true,
    piiPlanRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation: true,

    piiPlanDefinesFailurePiiRedactionRequired: true,
    piiPlanDefinesFailurePiiRedactionIncomplete: true,
    piiPlanDefinesFailurePiiRedactionConfidenceLow: true,
    piiPlanDefinesFailurePiiRedactionUnsafeForModel: true,
    piiPlanDefinesFailureBlockedHighRiskIdentifier: true,
    piiPlanDefinesFailureBlockedMedicalIdentifier: true,
    piiPlanDefinesFailureBlockedImmigrationIdentifier: true,
    piiPlanDefinesFailureBlockedFinancialIdentifier: true,
    piiPlanDefinesFailureBlockedUnknownDocumentIdentity: true,

    piiPlanRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly: true,
    piiPlanRequiresClaimAuthorizationUseRedactedAnchorsOnly: true,
    piiPlanRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized: true,
    piiPlanRequiresAuditTracesUsePlaceholderCategoriesOnly: true,
    piiPlanRequiresDeadlineLogicStillRequireDeliveryDateEvidence: true,
    piiPlanRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized: true,
    piiPlanRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts: true,

    actualPiiRedactionPlanOnly: true,
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

    piiPlanConfirmsNoOpenAiCall: true,
    piiPlanConfirmsNoFetchCall: true,
    piiPlanConfirmsNoProcessEnvRead: true,
    piiPlanConfirmsNoSdkUsage: true,
    piiPlanConfirmsNo8x3AcRerun: true,
    piiPlanConfirmsNoPaymentRuntimeCall: true,
    piiPlanConfirmsNoStripeCall: true,
    piiPlanConfirmsNoCheckoutCall: true,
    piiPlanConfirmsNoEntitlementRuntimeCall: true,
    piiPlanConfirmsNoServerEntitlementVerification: true,
    piiPlanConfirmsNoOcrRuntimeCall: true,
    piiPlanConfirmsNoStorageMutation: true,
    piiPlanConfirmsNoDatabaseWrite: true,
    piiPlanConfirmsNoAuditPersistence: true,
    piiPlanConfirmsNoUserVisibleDocumentExplanation: true,
    piiPlanConfirmsNoEvidenceEvaluation: true,
    piiPlanConfirmsNoClaimAuthorization: true,
    piiPlanConfirmsNoDeadlineCalculation: true,
    piiPlanConfirmsNoLegalCertainty: true,
    piiPlanConfirmsNoPromptBuild: true,
    piiPlanConfirmsNoModelCall: true,
    piiPlanConfirmsNoRunSmartTalkCall: true,
    piiPlanConfirmsNoRouteHandlerCall: true,
    piiPlanConfirmsNoRouteImport: true,
    piiPlanConfirmsNoFilesystemRead: true,
    piiPlanConfirmsNoPhotoRouteModification: true,

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
    td004PreModelPiiRedactionStillRequiresContract: true,
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

    readyFor8x6BPreModelPiiRedactionContract: true,
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
      "8.6A is a Pre-Model PII Redaction Plan.",
      "8.6A depends on completed 8.5W Paid Document Mode Boundary Closure Decision.",
      "8.6A is planning-only and creates no runtime behavior.",
      "8.6A does not modify /api/smart-talk.",
      "8.6A does not modify /api/smart-talk-photo.",
      "8.6A defines requirements for future pre-model PII redaction.",
      "8.6A does not implement PII redaction runtime.",
      "8.6A does not redact real text.",
      "8.6A does not process raw PII.",
      "8.6A does not authorize real document input.",
      "8.6A does not authorize user-visible output.",
      "8.6A does not authorize prompt build, model call, or runSmartTalk.",
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
      "TD-004 is now planned but still missing in production.",
      "TD-004 still requires contract and runtime implementation.",
      "TD-002 remains unresolved.",
      "8.3AC was not re-run.",
      "readyFor8x6BPreModelPiiRedactionContract is contract readiness only, not runtime authorization.",
      "readyForRealDocumentInput remains false.",
      "readyForUserVisibleOutput remains false.",
    ],
  };
}
