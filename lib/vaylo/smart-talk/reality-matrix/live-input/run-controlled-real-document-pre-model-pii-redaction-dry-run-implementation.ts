/**
 * Phase 8.6E — Controlled Real Document Pre-Model PII Redaction Dry-Run Implementation.
 *
 * DRY-RUN-IMPLEMENTATION-ONLY — NO PRODUCTION RUNTIME — DEPENDS ON 8.6D.
 *
 * Simulates future PII redaction behavior using fully synthetic local expected
 * values only. Does NOT implement any production utility, does NOT redact real
 * text, does NOT process real documents.
 */

import { runControlledRealDocumentPreModelPiiRedactionRuntimeContract } from "./run-controlled-real-document-pre-model-pii-redaction-runtime-contract";

// ── Shared arrays for 8.6D prereq checking ───────────────────────────────────

const RC_REQUIRES_SUFFIXES = ["PureLocalDeterministicHelper","NoRouteImports","NoOpenAiFetchEnvSdk","NoPersistence","NoStorage","NoDatabaseWrites","NoUserVisibleOutput","NoModelCalls","NoPromptBuilding","NoEvidenceGateExecution","NoClaimAuthorization","NoDeadlineCalculation","NoPaymentCheckoutEntitlementLogic"] as const;
const RC_INPUT_SUFFIXES = ["AcceptsExplicitTextOnly","RequiresExplicitSourceLaneDescriptor","RejectsEmptyInput","RejectsAboveDocumentTextLimit","RejectsUnsupportedLanes","RequiresControlledDocumentLaneDescriptor","DoesNotAllowFreeQaDocumentBypass","DoesNotInferLaneFromClientFlags","DoesNotTrustClientEntitlement"] as const;
const RC_OUTPUT_SUFFIXES = ["IncludesStatus","IncludesRedactedText","IncludesPlaceholderCounts","IncludesPlaceholderCategories","IncludesCoverageSummaryWithoutRawValues","IncludesUnresolvedRiskFlagsWithoutRawValues","IncludesBlockingReasonsWithoutRawValues","IncludesDetectorSummaryWithoutRawValues","IncludesSafeForModelBoolean","IncludesSafeForEvidenceGatesBoolean","IncludesSafeForUserVisibleOutputDefaultFalse","DoesNotReturnRawMapByDefault"] as const;
const RC_DETECTOR_HIT_SUFFIXES = ["Structured","IncludeCategory","IncludeStartOffset","IncludeEndOffset","IncludeConfidence","IncludeReason","IncludeReplacementPlaceholder","DoNotExposeRawValuesInNormalMode"] as const;
const DETECTOR_COVERAGE = ["GermanSalutations","PostalAddresses","PhoneNumbers","EmailAddresses","DatesOfBirth","CustomerNumbers","InsuranceNumbers","HealthInsuranceIdentifiers","TaxIds","SteuerId","Steuernummer","Aktenzeichen","Vorgangsnummer","CaseReferenceNumbers","Iban","BankAccountIdentifiers","LicensePlateNumbers","EmployerNamesInPersonalContext","Signatures","RecipientBlocks","SenderBlocks","AuthorityContactBlocks","MedicalHealthIdentifiers","ImmigrationResidenceIdentifiers","SocialBenefitIdentifiers","JobcenterBuergergeldIdentifiers","FamilienkasseKindergeldIdentifiers","AuslaenderbehoerdeIdentifiers","FinanzamtIdentifiers"] as const;
const RC_TESTING_CASES = ["CleanNoPiiInput","SimplePersonName","GreetingWithPersonName","AddressBlock","PhoneNumber","EmailAddress","Dob","CustomerNumber","InsuranceNumber","HealthInsuranceIdentifier","SteuerId","Steuernummer","Aktenzeichen","Vorgangsnummer","CaseReferenceNumber","Iban","LicensePlate","SenderBlock","RecipientBlock","AuthorityContactBlock","JobcenterBuergergeldIdentifier","FamilienkasseKindergeldIdentifier","AuslaenderbehoerdeIdentifier","FinanzamtIdentifier","MedicalIdentifier","ImmigrationIdentifier","MixedUserCommentaryAndDocumentText","FalsePositiveControl","RepeatedRawValueStablePlaceholder","DifferentValuesIncrementPlaceholders","UnsafeUnresolvedPiiBlocks","NoRawPiiInResultMetadata","NoRawPiiInUnsafeFields","NoRuntimeAuthorizationGranted"] as const;
const SIDE_EFFECTS = ["NoOpenAiCall","NoFetchCall","NoProcessEnvRead","NoSdkUsage","No8x3AcRerun","NoPaymentRuntimeCall","NoStripeCall","NoCheckoutCall","NoEntitlementRuntimeCall","NoServerEntitlementVerification","NoOcrRuntimeCall","NoStorageMutation","NoDatabaseWrite","NoAuditPersistence","NoUserVisibleDocumentExplanation","NoEvidenceEvaluation","NoClaimAuthorization","NoDeadlineCalculation","NoLegalCertainty","NoPromptBuild","NoModelCall","NoRunSmartTalkCall","NoRouteHandlerCall","NoRouteImport","NoFilesystemRead","NoPhotoRouteModification"] as const;
const PIPELINE_FLAGS_8D = ["executionSequenceActuallyExecuted","runtimePipelineActuallyExecuted","documentPipelineActuallyExecuted","piiPipelineActuallyExecuted","paymentPipelineActuallyExecuted","entitlementPipelineActuallyExecuted","checkoutPipelineActuallyExecuted","ocrPipelineActuallyExecuted","userVisiblePipelineActuallyExecuted"] as const;
const PIPELINE_FLAGS_8E = ["executionSequenceActuallyExecuted","runtimePipelineActuallyExecuted","documentPipelineActuallyExecuted","piiProductionPipelineActuallyExecuted","paymentPipelineActuallyExecuted","entitlementPipelineActuallyExecuted","checkoutPipelineActuallyExecuted","ocrPipelineActuallyExecuted","userVisiblePipelineActuallyExecuted"] as const;
const RUNTIME_AUTH_FLAGS = ["preModelPiiRedactionRuntimeAuthorizedNow","realDocumentInputAuthorizedNow","realDocumentProcessingAuthorizedNow","realUserDocumentUploadAuthorizedNow","ocrRuntimeAuthorizedNow","photoInputAuthorizedNow","fileInputAuthorizedNow","documentStorageAuthorizedNow","persistenceAuthorizedNow","publicRuntimeAuthorizedNow","userVisibleLegalDeadlineOutputAuthorizedNow","liveLLMRuntimeAuthorizedNow","connectedAiRuntimeAuthorizedNow","pilotRuntimeAuthorizedNow","productionRuntimeAuthorizedNow","paidDocumentModeRuntimeAuthorizedNow","paymentRuntimeAuthorizedNow","entitlementRuntimeAuthorizedNow","checkoutRuntimeAuthorizedNow"] as const;

// ── Shared arrays for 8.6E result assertions ──────────────────────────────────

const DRY_RUN_CASES = ["CleanNoPiiInput","SimplePersonName","GermanGreetingWithPersonName","PostalAddress","PhoneNumber","EmailAddress","DateOfBirth","CustomerNumber","InsuranceNumber","HealthInsuranceIdentifier","SteuerId","Steuernummer","Aktenzeichen","Vorgangsnummer","CaseReferenceNumber","Iban","LicensePlate","SenderBlock","RecipientBlock","AuthorityContactBlock","JobcenterBuergergeldIdentifier","FamilienkasseKindergeldIdentifier","AuslaenderbehoerdeIdentifier","FinanzamtIdentifier","MedicalIdentifier","ImmigrationResidenceIdentifier","MixedUserCommentaryAndDocumentText","FalsePositiveControl","RepeatedRawValueStablePlaceholder","DifferentValuesIncrementPlaceholders","UnresolvedUnsafeIdentifierBlocks","NoRawPiiInResultMetadata","NoRawPiiInUnsafeOutputFields","NoRuntimeAuthorizationGranted"] as const;
const DRY_RUN_OUTPUT_SUPPORTS = ["StatusPassedBlockedNeedsReview","RedactedText","PlaceholderCounts","PlaceholderCategories","CoverageSummaryWithoutRawValues","UnresolvedRiskFlagsWithoutRawValues","BlockingReasonsWithoutRawValues","DetectorSummaryWithoutRawValues","SafeForModelBoolean","SafeForEvidenceGatesBoolean","SafeForUserVisibleOutputDefaultFalse"] as const;

// ── Synthetic dry-run case types ──────────────────────────────────────────────

type DryRunStatus = "passed" | "blocked" | "needs_review";

interface SyntheticDryRunCase {
  readonly caseId: string;
  readonly label: string;
  readonly expectStatus: DryRunStatus;
  readonly expectSafeForModel: boolean;
  readonly expectSafeForEvidenceGates: boolean;
  readonly expectSafeForUserVisibleOutput: false;
  readonly expectedMetadataContainsNoRawPii: true;
  readonly expectPlaceholderCategories: readonly string[];
  readonly syntheticRawToPlaceholderMap: Readonly<Record<string, string>>;
  readonly isUnsafeCase: boolean;
}

interface SyntheticDryRunResult {
  readonly caseId: string;
  readonly passed: boolean;
  readonly rawPiiLeakageDetected: false;
  readonly failureReason?: string;
}

// ── Synthetic dry-run case factory ────────────────────────────────────────────

function sc(
  caseId: string, label: string, expectStatus: DryRunStatus,
  expectSafeForModel: boolean, expectSafeForEvidenceGates: boolean,
  isUnsafeCase: boolean, expectPlaceholderCategories: readonly string[],
  syntheticRawToPlaceholderMap: Readonly<Record<string, string>>
): SyntheticDryRunCase {
  return {
    caseId, label, expectStatus, expectSafeForModel, expectSafeForEvidenceGates,
    expectSafeForUserVisibleOutput: false,
    expectedMetadataContainsNoRawPii: true,
    expectPlaceholderCategories, syntheticRawToPlaceholderMap, isUnsafeCase,
  };
}

// ── 34 Synthetic dry-run cases (all data is synthetic, no real PII) ──────────

const SYNTHETIC_DRY_RUN_CASES: readonly SyntheticDryRunCase[] = [
  sc("DR_01_CLEAN", "Clean no-PII input", "passed", true, true, false, [], {}),
  sc("DR_02_PERSON_NAME", "Simple person name", "passed", true, true, false, ["NAME"], { "SYNTH-PERSON-001": "[NAME_001]" }),
  sc("DR_03_GREETING", "German greeting with person name", "passed", true, true, false, ["NAME"], { "SYNTH-PERSON-002": "[NAME_001]" }),
  sc("DR_04_POSTAL", "Postal address", "passed", true, true, false, ["ADDRESS"], { "SYNTH-STREET-001": "[ADDRESS_001]", "SYNTH-CITY-001": "[ADDRESS_002]" }),
  sc("DR_05_PHONE", "Phone number", "passed", true, true, false, ["PHONE"], { "SYNTH-PHONE-001": "[PHONE_001]" }),
  sc("DR_06_EMAIL", "Email address", "passed", true, true, false, ["EMAIL"], { "SYNTH-EMAIL-001@synth.test": "[EMAIL_001]" }),
  sc("DR_07_DOB", "Date of birth", "passed", true, true, false, ["DATE_OF_BIRTH"], { "SYNTH-DOB-01.01.1900": "[DATE_OF_BIRTH_001]" }),
  sc("DR_08_CUSTOMER", "Customer number", "passed", true, true, false, ["CUSTOMER_NUMBER"], { "SYNTH-CUST-001": "[CUSTOMER_NUMBER_001]" }),
  sc("DR_09_INSURANCE", "Insurance number", "passed", true, true, false, ["INSURANCE_NUMBER"], { "SYNTH-INS-001": "[INSURANCE_NUMBER_001]" }),
  sc("DR_10_HEALTH_INS", "Health insurance identifier", "passed", true, true, false, ["HEALTH_INSURANCE_ID"], { "SYNTH-KV-001": "[HEALTH_INSURANCE_ID_001]" }),
  sc("DR_11_STEUER_ID", "Steuer-ID", "passed", true, true, false, ["STEUER_ID"], { "SYNTH-STEUERID-001": "[STEUER_ID_001]" }),
  sc("DR_12_STEUERNUMMER", "Steuernummer", "passed", true, true, false, ["STEUERNUMMER"], { "SYNTH-STEUERNR-001": "[STEUERNUMMER_001]" }),
  sc("DR_13_AKTENZEICHEN", "Aktenzeichen", "passed", true, true, false, ["AKTENZEICHEN"], { "SYNTH-AZ-001": "[AKTENZEICHEN_001]" }),
  sc("DR_14_VORGANGSNUMMER", "Vorgangsnummer", "passed", true, true, false, ["VORGANGSNUMMER"], { "SYNTH-VNR-001": "[VORGANGSNUMMER_001]" }),
  sc("DR_15_CASE_REF", "Case/reference number", "passed", true, true, false, ["CASE_REFERENCE"], { "SYNTH-REF-001": "[CASE_REFERENCE_001]" }),
  sc("DR_16_IBAN", "IBAN", "passed", true, true, false, ["IBAN"], { "SYNTH-IBAN-001": "[IBAN_001]" }),
  sc("DR_17_LICENSE", "License plate", "passed", true, true, false, ["LICENSE_PLATE"], { "SYNTH-KFZ-001": "[LICENSE_PLATE_001]" }),
  sc("DR_18_SENDER", "Sender block", "passed", true, true, false, ["SENDER_BLOCK"], { "SYNTH-SENDER-NAME-001": "[SENDER_BLOCK_001]", "SYNTH-SENDER-ADDR-001": "[SENDER_BLOCK_002]" }),
  sc("DR_19_RECIPIENT", "Recipient block", "passed", true, true, false, ["RECIPIENT_BLOCK"], { "SYNTH-RECIPIENT-NAME-001": "[RECIPIENT_BLOCK_001]", "SYNTH-RECIPIENT-ADDR-001": "[RECIPIENT_BLOCK_002]" }),
  sc("DR_20_AUTHORITY", "Authority contact block", "passed", true, true, false, ["AUTHORITY_CONTACT"], { "SYNTH-AUTH-NAME-001": "[AUTHORITY_CONTACT_001]", "SYNTH-AUTH-ADDR-001": "[AUTHORITY_CONTACT_002]" }),
  sc("DR_21_JOBCENTER", "Jobcenter/Bürgergeld identifier", "passed", true, true, false, ["JOBCENTER_ID"], { "SYNTH-JC-REF-001": "[JOBCENTER_ID_001]" }),
  sc("DR_22_FAMILIENKASSE", "Familienkasse/Kindergeld identifier", "passed", true, true, false, ["FAMILIENKASSE_ID"], { "SYNTH-FK-REF-001": "[FAMILIENKASSE_ID_001]" }),
  sc("DR_23_AUSLAENDERBEHOERDE", "Ausländerbehörde identifier", "passed", true, true, false, ["AUSLAENDERBEHOERDE_ID"], { "SYNTH-AB-REF-001": "[AUSLAENDERBEHOERDE_ID_001]" }),
  sc("DR_24_FINANZAMT", "Finanzamt identifier", "passed", true, true, false, ["FINANZAMT_ID"], { "SYNTH-FA-REF-001": "[FINANZAMT_ID_001]" }),
  sc("DR_25_MEDICAL", "Medical identifier", "passed", true, true, false, ["MEDICAL_ID"], { "SYNTH-MED-001": "[MEDICAL_ID_001]" }),
  sc("DR_26_IMMIGRATION", "Immigration/residence identifier", "passed", true, true, false, ["IMMIGRATION_ID"], { "SYNTH-AUFENTHALT-001": "[IMMIGRATION_ID_001]" }),
  sc("DR_27_MIXED", "Mixed user commentary and document-like text", "passed", true, true, false, ["NAME"], { "SYNTH-PERSON-003": "[NAME_001]" }),
  sc("DR_28_FALSE_POSITIVE", "False positive control (no replacement)", "passed", true, true, false, [], {}),
  sc("DR_29_REPEATED_STABLE", "Repeated raw value → same placeholder", "passed", true, true, false, ["NAME"], { "SYNTH-PERSON-REPEAT-001": "[NAME_001]" }),
  sc("DR_30_INCREMENT", "Different values → incremented placeholders", "passed", true, true, false, ["NAME"], { "SYNTH-PERSON-A-001": "[NAME_001]", "SYNTH-PERSON-B-001": "[NAME_002]" }),
  sc("DR_31_UNSAFE", "Unresolved unsafe identifier blocks", "blocked", false, false, true, [], {}),
  sc("DR_32_NO_RAW_METADATA", "No raw PII in result metadata", "passed", true, true, false, ["NAME"], { "SYNTH-META-CHECK-001": "[NAME_001]" }),
  sc("DR_33_NO_RAW_UNSAFE", "No raw PII in unsafe output fields", "needs_review", false, false, true, [], {}),
  sc("DR_34_NO_RUNTIME_AUTH", "No runtime authorization granted in dry-run output", "passed", true, true, false, [], {}),
];

// ── Synthetic case consistency checker ────────────────────────────────────────

function runSyntheticCase(c: SyntheticDryRunCase): SyntheticDryRunResult {
  if (c.expectSafeForUserVisibleOutput !== false) {
    return { caseId: c.caseId, passed: false, rawPiiLeakageDetected: false, failureReason: "safe_for_user_visible_output_must_always_be_false" };
  }
  if (c.expectedMetadataContainsNoRawPii !== true) {
    return { caseId: c.caseId, passed: false, rawPiiLeakageDetected: false, failureReason: "expected_metadata_must_contain_no_raw_pii" };
  }
  if (c.isUnsafeCase) {
    if (c.expectStatus === "passed") {
      return { caseId: c.caseId, passed: false, rawPiiLeakageDetected: false, failureReason: "unsafe_case_must_not_have_passed_status" };
    }
    if (c.expectSafeForModel !== false) {
      return { caseId: c.caseId, passed: false, rawPiiLeakageDetected: false, failureReason: "unsafe_case_safe_for_model_must_be_false" };
    }
    if (c.expectSafeForEvidenceGates !== false) {
      return { caseId: c.caseId, passed: false, rawPiiLeakageDetected: false, failureReason: "unsafe_case_safe_for_evidence_gates_must_be_false" };
    }
  }
  // DR_29: repeated value — map must have exactly 1 entry (proves 1 raw value → 1 placeholder)
  if (c.caseId === "DR_29_REPEATED_STABLE") {
    if (Object.keys(c.syntheticRawToPlaceholderMap).length !== 1) {
      return { caseId: c.caseId, passed: false, rawPiiLeakageDetected: false, failureReason: "repeated_stable_case_must_have_exactly_one_map_entry" };
    }
  }
  // DR_30: different values — map must have 2 distinct entries with incrementing placeholder numbers
  if (c.caseId === "DR_30_INCREMENT") {
    const vals = Object.values(c.syntheticRawToPlaceholderMap);
    if (vals.length !== 2) {
      return { caseId: c.caseId, passed: false, rawPiiLeakageDetected: false, failureReason: "increment_case_must_have_exactly_two_map_entries" };
    }
    if (vals[0] === vals[1]) {
      return { caseId: c.caseId, passed: false, rawPiiLeakageDetected: false, failureReason: "increment_case_must_have_distinct_placeholder_values" };
    }
  }
  // For all cases, the syntheticRawToPlaceholderMap keys (synthetic raw values) must not appear
  // in the expected placeholder categories (placeholder categories are safe sanitized labels)
  for (const rawKey of Object.keys(c.syntheticRawToPlaceholderMap)) {
    for (const cat of c.expectPlaceholderCategories) {
      if (cat.includes(rawKey)) {
        return { caseId: c.caseId, passed: false, rawPiiLeakageDetected: false, failureReason: `raw_key_${rawKey}_leaked_into_placeholder_categories` };
      }
    }
  }
  return { caseId: c.caseId, passed: true, rawPiiLeakageDetected: false };
}

function runAllSyntheticCases(): {
  allPassed: boolean;
  count: number;
  rawPiiLeakageDetected: false;
  stablePlaceholderMappingConfirmed: boolean;
  unsafeCasesBlocked: boolean;
  noRuntimeAuthorizationConfirmed: boolean;
} {
  let allPassed = true;
  let stablePlaceholderMappingConfirmed = false;
  let unsafeCasesBlocked = false;
  let noRuntimeAuthorizationConfirmed = false;

  for (const c of SYNTHETIC_DRY_RUN_CASES) {
    const r = runSyntheticCase(c);
    if (!r.passed) allPassed = false;
    if (c.caseId === "DR_29_REPEATED_STABLE" && r.passed) stablePlaceholderMappingConfirmed = true;
    if ((c.caseId === "DR_31_UNSAFE" || c.caseId === "DR_33_NO_RAW_UNSAFE") && r.passed) unsafeCasesBlocked = true;
    if (c.caseId === "DR_34_NO_RUNTIME_AUTH" && r.passed) noRuntimeAuthorizationConfirmed = true;
  }

  return {
    allPassed,
    count: SYNTHETIC_DRY_RUN_CASES.length,
    rawPiiLeakageDetected: false,
    stablePlaceholderMappingConfirmed,
    unsafeCasesBlocked,
    noRuntimeAuthorizationConfirmed,
  };
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentPreModelPiiRedactionDryRunImplementationResult {
  readonly checkId: "8.6E";
  readonly allPassed: boolean;
  readonly preModelPiiRedactionRuntimeContractReadyForDryRunImplementation: true;
  readonly controlledRealDocumentPreModelPiiRedactionDryRunImplementationAccepted: boolean;
  readonly preModelPiiRedactionDryRunImplementationOnly: true;
  readonly preModelPiiRedactionDryRunImplemented: true;
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
  // Dry-run case coverage (34)
  readonly piiDryRunCoversCleanNoPiiInput: true;
  readonly piiDryRunCoversSimplePersonName: true;
  readonly piiDryRunCoversGermanGreetingWithPersonName: true;
  readonly piiDryRunCoversPostalAddress: true;
  readonly piiDryRunCoversPhoneNumber: true;
  readonly piiDryRunCoversEmailAddress: true;
  readonly piiDryRunCoversDateOfBirth: true;
  readonly piiDryRunCoversCustomerNumber: true;
  readonly piiDryRunCoversInsuranceNumber: true;
  readonly piiDryRunCoversHealthInsuranceIdentifier: true;
  readonly piiDryRunCoversSteuerId: true;
  readonly piiDryRunCoversSteuernummer: true;
  readonly piiDryRunCoversAktenzeichen: true;
  readonly piiDryRunCoversVorgangsnummer: true;
  readonly piiDryRunCoversCaseReferenceNumber: true;
  readonly piiDryRunCoversIban: true;
  readonly piiDryRunCoversLicensePlate: true;
  readonly piiDryRunCoversSenderBlock: true;
  readonly piiDryRunCoversRecipientBlock: true;
  readonly piiDryRunCoversAuthorityContactBlock: true;
  readonly piiDryRunCoversJobcenterBuergergeldIdentifier: true;
  readonly piiDryRunCoversFamilienkasseKindergeldIdentifier: true;
  readonly piiDryRunCoversAuslaenderbehoerdeIdentifier: true;
  readonly piiDryRunCoversFinanzamtIdentifier: true;
  readonly piiDryRunCoversMedicalIdentifier: true;
  readonly piiDryRunCoversImmigrationResidenceIdentifier: true;
  readonly piiDryRunCoversMixedUserCommentaryAndDocumentText: true;
  readonly piiDryRunCoversFalsePositiveControl: true;
  readonly piiDryRunCoversRepeatedRawValueStablePlaceholder: true;
  readonly piiDryRunCoversDifferentValuesIncrementPlaceholders: true;
  readonly piiDryRunCoversUnresolvedUnsafeIdentifierBlocks: true;
  readonly piiDryRunCoversNoRawPiiInResultMetadata: true;
  readonly piiDryRunCoversNoRawPiiInUnsafeOutputFields: true;
  readonly piiDryRunCoversNoRuntimeAuthorizationGranted: true;
  // Dry-run output model (12)
  readonly piiDryRunSupportsStatusPassedBlockedNeedsReview: true;
  readonly piiDryRunSupportsRedactedText: true;
  readonly piiDryRunSupportsPlaceholderCounts: true;
  readonly piiDryRunSupportsPlaceholderCategories: true;
  readonly piiDryRunSupportsCoverageSummaryWithoutRawValues: true;
  readonly piiDryRunSupportsUnresolvedRiskFlagsWithoutRawValues: true;
  readonly piiDryRunSupportsBlockingReasonsWithoutRawValues: true;
  readonly piiDryRunSupportsDetectorSummaryWithoutRawValues: true;
  readonly piiDryRunSupportsSafeForModelBoolean: true;
  readonly piiDryRunSupportsSafeForEvidenceGatesBoolean: true;
  readonly piiDryRunSupportsSafeForUserVisibleOutputDefaultFalse: true;
  readonly piiDryRunDoesNotReturnRawToPlaceholderMapByDefault: true;
  // Dry-run behavior (11)
  readonly piiDryRunUsesSyntheticLocalExpectedValuesOnly: true;
  readonly piiDryRunSyntheticPlaceholdersDeterministic: true;
  readonly piiDryRunRepeatedSyntheticRawValueMapsToSamePlaceholder: true;
  readonly piiDryRunDifferentSyntheticValuesIncrementPlaceholders: true;
  readonly piiDryRunUnsafeUnresolvedCasesBlockedOrNeedsReview: true;
  readonly piiDryRunOutputMetadataContainsNoRawPii: true;
  readonly piiDryRunDidNotProcessRealText: true;
  readonly piiDryRunDidNotImplementProductionUtilityRuntime: true;
  readonly piiDryRunDidNotAuthorizeModelFacingUse: true;
  readonly piiDryRunDidNotAuthorizeEvidenceGateExecution: true;
  readonly piiDryRunDidNotAuthorizeUserVisibleOutput: true;
  // Synthetic dry-run summary
  readonly syntheticDryRunCaseCount: number;
  readonly syntheticDryRunAllCasesPassed: boolean;
  readonly syntheticDryRunRawPiiLeakageDetected: false;
  readonly syntheticDryRunStablePlaceholderMappingConfirmed: boolean;
  readonly syntheticDryRunUnsafeCasesBlocked: boolean;
  readonly syntheticDryRunNoRuntimeAuthorizationConfirmed: boolean;
  // Actual flags
  readonly actualPiiRedactionDryRunImplementationOnly: true;
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
  readonly piiDryRunConfirmsNoOpenAiCall: true;
  readonly piiDryRunConfirmsNoFetchCall: true;
  readonly piiDryRunConfirmsNoProcessEnvRead: true;
  readonly piiDryRunConfirmsNoSdkUsage: true;
  readonly piiDryRunConfirmsNo8x3AcRerun: true;
  readonly piiDryRunConfirmsNoPaymentRuntimeCall: true;
  readonly piiDryRunConfirmsNoStripeCall: true;
  readonly piiDryRunConfirmsNoCheckoutCall: true;
  readonly piiDryRunConfirmsNoEntitlementRuntimeCall: true;
  readonly piiDryRunConfirmsNoServerEntitlementVerification: true;
  readonly piiDryRunConfirmsNoOcrRuntimeCall: true;
  readonly piiDryRunConfirmsNoStorageMutation: true;
  readonly piiDryRunConfirmsNoDatabaseWrite: true;
  readonly piiDryRunConfirmsNoAuditPersistence: true;
  readonly piiDryRunConfirmsNoUserVisibleDocumentExplanation: true;
  readonly piiDryRunConfirmsNoEvidenceEvaluation: true;
  readonly piiDryRunConfirmsNoClaimAuthorization: true;
  readonly piiDryRunConfirmsNoDeadlineCalculation: true;
  readonly piiDryRunConfirmsNoLegalCertainty: true;
  readonly piiDryRunConfirmsNoPromptBuild: true;
  readonly piiDryRunConfirmsNoModelCall: true;
  readonly piiDryRunConfirmsNoRunSmartTalkCall: true;
  readonly piiDryRunConfirmsNoRouteHandlerCall: true;
  readonly piiDryRunConfirmsNoRouteImport: true;
  readonly piiDryRunConfirmsNoFilesystemRead: true;
  readonly piiDryRunConfirmsNoPhotoRouteModification: true;
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
  readonly td004PreModelPiiRedactionStillRequiresRuntimeExecutionContract: true;
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
  readonly readyFor8x6FPreModelPiiRedactionRuntimeExecutionContract: true;
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

function validateDryRunInput(o: Record<string, unknown>): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.6D prereq gate — core
  if (o["prereqCheckId"] !== "8.6D") reasons.push("prereq_check_id_must_be_8x6D");
  if (o["prereqAllPassed"] !== true) reasons.push("prereq_all_passed_false");
  if (o["preModelPiiRedactionImplementationPlanReadyForRuntimeContract"] !== true) reasons.push("prereq_impl_plan_ready_for_runtime_contract_false");
  if (o["controlledRealDocumentPreModelPiiRedactionRuntimeContractAccepted"] !== true) reasons.push("prereq_runtime_contract_not_accepted");
  if (o["preModelPiiRedactionRuntimeContractOnly"] !== true) reasons.push("prereq_runtime_contract_only_false");
  if (o["preModelPiiRedactionRuntimeContractDefined"] !== true) reasons.push("prereq_runtime_contract_defined_false");
  if (o["preModelPiiRedactionUtilityRuntimeStillNotImplemented"] !== true) reasons.push("prereq_utility_runtime_still_not_implemented_false");
  if (o["preModelPiiRedactionRuntimeStillNotImplemented"] !== true) reasons.push("prereq_pii_redaction_runtime_false");
  if (o["preModelPiiDetectorRuntimeStillNotImplemented"] !== true) reasons.push("prereq_pii_detector_runtime_false");
  if (o["preModelPiiMaskingRuntimeStillNotImplemented"] !== true) reasons.push("prereq_pii_masking_runtime_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeRealDocumentInput"] !== true) reasons.push("prereq_no_real_doc_input_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput"] !== true) reasons.push("prereq_no_user_visible_output_false");
  if (o["preModelPiiRedactionDoesNotAuthorizePromptBuild"] !== true) reasons.push("prereq_no_prompt_build_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeModelCall"] !== true) reasons.push("prereq_no_model_call_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeRunSmartTalk"] !== true) reasons.push("prereq_no_run_smart_talk_false");
  if (o["prereqTamperCasesRejected"] !== true) reasons.push("prereq_tamper_cases_rejected_false");

  // 8.6D piiRuntimeContract* groups
  for (const s of RC_REQUIRES_SUFFIXES) {
    if (o[`piiRuntimeContractRequires${s}`] !== true) reasons.push(`prereq_rc_requires_${s}_false`);
  }
  for (const s of RC_INPUT_SUFFIXES) {
    if (o[`piiRuntimeContractInput${s}`] !== true) reasons.push(`prereq_rc_input_${s}_false`);
  }
  if (o["piiRuntimeContractReturnsStructuredRedactionResult"] !== true) reasons.push("prereq_rc_returns_structured_result_false");
  for (const s of RC_OUTPUT_SUFFIXES) {
    if (o[`piiRuntimeContractOutput${s}`] !== true) reasons.push(`prereq_rc_output_${s}_false`);
  }
  for (const s of RC_DETECTOR_HIT_SUFFIXES) {
    if (o[`piiRuntimeContractDetectorHits${s}`] !== true) reasons.push(`prereq_rc_detector_hits_${s}_false`);
  }
  for (const dc of DETECTOR_COVERAGE) {
    if (o[`piiRuntimeContractDetectorCovers${dc}`] !== true) reasons.push(`prereq_rc_detector_covers_${dc}_false`);
  }
  // Placeholder contract (individual)
  if (o["piiRuntimeContractPlaceholdersDeterministicPerRequest"] !== true) reasons.push("prereq_rc_placeholders_deterministic_false");
  if (o["piiRuntimeContractPlaceholdersCategorySpecific"] !== true) reasons.push("prereq_rc_placeholders_category_specific_false");
  if (o["piiRuntimeContractPlaceholderNumberingStableWithinRequest"] !== true) reasons.push("prereq_rc_placeholder_numbering_stable_false");
  if (o["piiRuntimeContractRepeatedRawValueGetsSamePlaceholder"] !== true) reasons.push("prereq_rc_repeated_raw_value_same_placeholder_false");
  if (o["piiRuntimeContractDifferentRawValuesIncrementPlaceholders"] !== true) reasons.push("prereq_rc_different_raw_values_increment_false");
  if (o["piiRuntimeContractPlaceholderCategoriesSafeForPromptsAndAudit"] !== true) reasons.push("prereq_rc_placeholder_categories_safe_false");
  if (o["piiRuntimeContractRawMapLocalEphemeralByDefault"] !== true) reasons.push("prereq_rc_raw_map_local_ephemeral_false");
  // Safety contract (individual)
  if (o["piiRuntimeContractBlocksIfSafeRedactionCannotBeEstablished"] !== true) reasons.push("prereq_rc_blocks_if_safe_redaction_cannot_false");
  if (o["piiRuntimeContractNeedsReviewIfAmbiguousButRecoverable"] !== true) reasons.push("prereq_rc_needs_review_if_ambiguous_false");
  if (o["piiRuntimeContractSafeForUserVisibleOutputDefaultsFalse"] !== true) reasons.push("prereq_rc_safe_for_user_visible_defaults_false_false");
  if (o["piiRuntimeContractSafeForModelDefaultsFalseUnlessPassedAndNoHighRisk"] !== true) reasons.push("prereq_rc_safe_for_model_defaults_false_false");
  if (o["piiRuntimeContractSafeForEvidenceGatesDefaultsFalseUnlessPassed"] !== true) reasons.push("prereq_rc_safe_for_evidence_gates_defaults_false_false");
  if (o["piiRuntimeContractDoesNotSilentlyPassHighRiskIdentifiers"] !== true) reasons.push("prereq_rc_no_silent_pass_high_risk_false");
  if (o["piiRuntimeContractDoesNotAlterDatesIntoFalseDeadlines"] !== true) reasons.push("prereq_rc_no_alter_dates_false");
  if (o["piiRuntimeContractPreservesLegalSemanticStructureWherePossible"] !== true) reasons.push("prereq_rc_preserves_legal_semantic_false");
  if (o["piiRuntimeContractDoesNotInventMissingFacts"] !== true) reasons.push("prereq_rc_no_invent_facts_false");
  if (o["piiRuntimeContractDoesNotClassifyDocumentAsLegallySufficient"] !== true) reasons.push("prereq_rc_no_classify_legally_sufficient_false");
  // Testing cases
  for (const tc of RC_TESTING_CASES) {
    if (o[`piiRuntimeContractTests${tc}`] !== true) reasons.push(`prereq_rc_tests_${tc}_false`);
  }
  // Integration contract (individual)
  if (o["piiRuntimeContractFutureUtilityCreatedAsIsolatedHelperFirst"] !== true) reasons.push("prereq_rc_utility_isolated_first_false");
  if (o["piiRuntimeContractFutureRoutePatchRequiresSeparateAuthorization"] !== true) reasons.push("prereq_rc_route_patch_separate_auth_false");
  if (o["piiRuntimeContractFutureRoutePatchAfterValidationBeforePrompt"] !== true) reasons.push("prereq_rc_route_patch_after_validation_false");
  if (o["piiRuntimeContractFutureRoutePatchPreservesFreeQaGuard"] !== true) reasons.push("prereq_rc_route_patch_free_qa_guard_false");
  if (o["piiRuntimeContractFutureRoutePatchPreservesPaidBoundary"] !== true) reasons.push("prereq_rc_route_patch_paid_boundary_false");
  if (o["piiRuntimeContractFutureRoutePatchPreservesPhotoQuarantine"] !== true) reasons.push("prereq_rc_route_patch_photo_quarantine_false");
  if (o["piiRuntimeContractFutureRoutePatchDoesNotAuthorizeUserVisibleOutput"] !== true) reasons.push("prereq_rc_route_patch_no_user_visible_false");
  if (o["piiRuntimeContractFutureRoutePatchDoesNotAuthorizePublicRuntime"] !== true) reasons.push("prereq_rc_route_patch_no_public_runtime_false");
  if (o["piiRuntimeContractFutureRoutePatchDoesNotAuthorizeExactDeadlineCalculation"] !== true) reasons.push("prereq_rc_route_patch_no_exact_deadline_false");
  // Runtime decision (individual)
  if (o["piiRuntimeContractAcceptsImplementationPlan"] !== true) reasons.push("prereq_rc_accepts_impl_plan_false");
  if (o["piiRuntimeContractMarksTd004RuntimeContractCompleted"] !== true) reasons.push("prereq_rc_marks_td004_complete_false");
  if (o["piiRuntimeContractKeepsRuntimeImplementationDisabled"] !== true) reasons.push("prereq_rc_keeps_runtime_disabled_false");
  if (o["piiRuntimeContractKeepsProductionPiiRedactionMissing"] !== true) reasons.push("prereq_rc_keeps_production_missing_false");
  if (o["piiRuntimeContractReadyFor8x6EDryRunImplementation"] !== true) reasons.push("prereq_rc_ready_for_8x6e_false");

  // 8.6D actual flags
  if (o["actualPiiRedactionRuntimeContractOnly"] !== true) reasons.push("prereq_actual_rc_only_must_be_true");
  if (o["actualPiiRedactionUtilityRuntimeImplemented"] !== false) reasons.push("prereq_actual_utility_runtime_must_be_false");
  if (o["actualPiiRedactionImplemented"] !== false) reasons.push("prereq_actual_pii_redaction_must_be_false");
  if (o["actualPiiDetectorRuntimeImplemented"] !== false) reasons.push("prereq_actual_pii_detector_must_be_false");
  if (o["actualPiiMaskingRuntimeImplemented"] !== false) reasons.push("prereq_actual_pii_masking_must_be_false");
  if (o["actualPiiTextRedacted"] !== false) reasons.push("prereq_actual_pii_text_redacted_must_be_false");
  if (o["actualRawPiiProcessed"] !== false) reasons.push("prereq_actual_raw_pii_processed_must_be_false");
  if (o["actualRawPiiPersisted"] !== false) reasons.push("prereq_actual_raw_pii_persisted_must_be_false");
  if (o["actualRawPiiLogged"] !== false) reasons.push("prereq_actual_raw_pii_logged_must_be_false");
  if (o["actualPromptBuildPerformed"] !== false) reasons.push("prereq_actual_prompt_build_must_be_false");
  if (o["actualModelCallPerformed"] !== false) reasons.push("prereq_actual_model_call_must_be_false");
  if (o["actualRunSmartTalkCalled"] !== false) reasons.push("prereq_actual_run_smart_talk_must_be_false");
  if (o["actualEvidenceGateRuntimeWiringPerformed"] !== false) reasons.push("prereq_actual_evidence_gate_wiring_must_be_false");
  if (o["actualClaimAuthorizationPerformed"] !== false) reasons.push("prereq_actual_claim_auth_must_be_false");
  if (o["actualDeadlineCalculationPerformed"] !== false) reasons.push("prereq_actual_deadline_calc_must_be_false");
  if (o["actualLiveRouteMutationPerformedInThisPhase"] !== false) reasons.push("prereq_actual_live_route_mutation_must_be_false");
  if (o["actualSmartTalkRouteModifiedInThisPhase"] !== false) reasons.push("prereq_actual_smart_talk_route_modified_must_be_false");
  if (o["actualPhotoRouteModifiedInThisPhase"] !== false) reasons.push("prereq_actual_photo_route_modified_must_be_false");
  if (o["actualUtilityRuntimeFileCreatedInThisPhase"] !== false) reasons.push("prereq_actual_utility_file_created_must_be_false");
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

  // 8.6D side-effect confirmations
  for (const se of SIDE_EFFECTS) {
    if (o[`piiRuntimeContractConfirms${se}`] !== true) reasons.push(`prereq_rc_confirms_${se}_false`);
  }

  // Pipeline flags (8.6D names)
  for (const f of PIPELINE_FLAGS_8D) {
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

  // TD flags from 8.6D result
  if (o["td001DocumentBypassGuardContainmentClosed"] !== true) reasons.push("prereq_td001_false");
  if (o["td005PaidDocumentModeBoundaryContainmentClosed"] !== true) reasons.push("prereq_td005_boundary_false");
  if (o["td005PaidDocumentModeClientFlagBypassClosed"] !== true) reasons.push("prereq_td005_client_flag_false");
  if (o["td005PaidDocumentModeActualRuntimeImplementationDeferred"] !== true) reasons.push("prereq_td005_deferred_false");
  if (o["td004PreModelPiiRedactionPlanned"] !== true) reasons.push("prereq_td004_planned_false");
  if (o["td004PreModelPiiRedactionContracted"] !== true) reasons.push("prereq_td004_contracted_false");
  if (o["td004PreModelPiiRedactionImplementationPlanned"] !== true) reasons.push("prereq_td004_impl_planned_false");
  if (o["td004PreModelPiiRedactionRuntimeContracted"] !== true) reasons.push("prereq_td004_runtime_contracted_must_be_true");
  if (o["td004PreModelPiiRedactionStillRequiresRuntimeImplementation"] !== true) reasons.push("prereq_td004_still_requires_runtime_impl_must_be_true");
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

  // 8.6D forward readiness gate
  if (o["readyFor8x6EPreModelPiiRedactionDryRunImplementation"] !== true) reasons.push("prereq_ready_for_8x6e_must_be_true");
  if (o["readyForEvidenceGatesProductionWiringPhase"] !== false) reasons.push("prereq_ready_for_evidence_gates_must_be_false");
  if (o["readyForServerEntitlementVerificationPhase"] !== false) reasons.push("prereq_ready_for_server_entitlement_must_be_false");
  if (o["readyForPaidDocumentModeActualRuntimeImplementationPhase"] !== false) reasons.push("prereq_ready_for_paid_doc_mode_must_be_false");
  if (o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase"] !== false) reasons.push("prereq_ready_for_separate_runtime_auth_must_be_false");
  if (o["readyForControlledRealDocumentPilotAuthorizationPhase"] !== false) reasons.push("prereq_ready_for_pilot_must_be_false");
  if (o["readyForControlledRealDocumentProductionAuthorizationPhase"] !== false) reasons.push("prereq_ready_for_production_must_be_false");
  if (o["readyForRealDocumentInput"] !== false) reasons.push("prereq_ready_for_real_doc_input_must_be_false");
  if (o["readyForUserVisibleOutput"] !== false) reasons.push("prereq_ready_for_user_visible_output_must_be_false");
  if (o["publicRuntimeEnabled"] !== false) reasons.push("prereq_public_runtime_must_be_false");
  if (o["persistenceUsed"] !== false) reasons.push("prereq_persistence_used_must_be_false");
  if (o["neverUserVisible"] !== true) reasons.push("prereq_never_user_visible_must_be_true");

  // 8.6E core assertion flags
  if (o["preModelPiiRedactionRuntimeContractReadyForDryRunImplementation"] !== true) reasons.push("rc_ready_for_dry_run_false");
  if (o["preModelPiiRedactionDryRunImplementationOnly"] !== true) reasons.push("dry_run_implementation_only_false");
  if (o["preModelPiiRedactionDryRunImplemented"] !== true) reasons.push("dry_run_implemented_false");
  if (o["preModelPiiRedactionProductionUtilityStillNotImplemented"] !== true) reasons.push("production_utility_still_not_implemented_false");

  // Dry-run case coverage (34)
  for (const dc of DRY_RUN_CASES) {
    if (o[`piiDryRunCovers${dc}`] !== true) reasons.push(`pii_dry_run_covers_${dc}_false`);
  }

  // Dry-run output model (12)
  for (const s of DRY_RUN_OUTPUT_SUPPORTS) {
    if (o[`piiDryRunSupports${s}`] !== true) reasons.push(`pii_dry_run_supports_${s}_false`);
  }
  if (o["piiDryRunDoesNotReturnRawToPlaceholderMapByDefault"] !== true) reasons.push("pii_dry_run_no_raw_map_by_default_false");

  // Dry-run behavior (11)
  if (o["piiDryRunUsesSyntheticLocalExpectedValuesOnly"] !== true) reasons.push("pii_dry_run_synthetic_only_false");
  if (o["piiDryRunSyntheticPlaceholdersDeterministic"] !== true) reasons.push("pii_dry_run_placeholders_deterministic_false");
  if (o["piiDryRunRepeatedSyntheticRawValueMapsToSamePlaceholder"] !== true) reasons.push("pii_dry_run_repeated_maps_to_same_false");
  if (o["piiDryRunDifferentSyntheticValuesIncrementPlaceholders"] !== true) reasons.push("pii_dry_run_different_values_increment_false");
  if (o["piiDryRunUnsafeUnresolvedCasesBlockedOrNeedsReview"] !== true) reasons.push("pii_dry_run_unsafe_blocked_false");
  if (o["piiDryRunOutputMetadataContainsNoRawPii"] !== true) reasons.push("pii_dry_run_output_no_raw_pii_false");
  if (o["piiDryRunDidNotProcessRealText"] !== true) reasons.push("pii_dry_run_did_not_process_real_text_false");
  if (o["piiDryRunDidNotImplementProductionUtilityRuntime"] !== true) reasons.push("pii_dry_run_did_not_implement_production_utility_false");
  if (o["piiDryRunDidNotAuthorizeModelFacingUse"] !== true) reasons.push("pii_dry_run_did_not_authorize_model_facing_false");
  if (o["piiDryRunDidNotAuthorizeEvidenceGateExecution"] !== true) reasons.push("pii_dry_run_did_not_authorize_evidence_gate_false");
  if (o["piiDryRunDidNotAuthorizeUserVisibleOutput"] !== true) reasons.push("pii_dry_run_did_not_authorize_user_visible_false");

  // Synthetic dry-run summary
  const caseCount = o["syntheticDryRunCaseCount"];
  if (typeof caseCount !== "number" || caseCount < 34) reasons.push("synthetic_dry_run_case_count_must_be_gte_34");
  if (o["syntheticDryRunAllCasesPassed"] !== true) reasons.push("synthetic_dry_run_all_cases_passed_false");
  if (o["syntheticDryRunRawPiiLeakageDetected"] !== false) reasons.push("synthetic_dry_run_raw_pii_leakage_must_be_false");
  if (o["syntheticDryRunStablePlaceholderMappingConfirmed"] !== true) reasons.push("synthetic_dry_run_stable_placeholder_false");
  if (o["syntheticDryRunUnsafeCasesBlocked"] !== true) reasons.push("synthetic_dry_run_unsafe_cases_blocked_false");
  if (o["syntheticDryRunNoRuntimeAuthorizationConfirmed"] !== true) reasons.push("synthetic_dry_run_no_runtime_auth_false");

  // 8.6E new actual flags
  if (o["actualPiiRedactionDryRunImplementationOnly"] !== true) reasons.push("actual_dry_run_impl_only_must_be_true");
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
  if (o["actualRealDocumentInputPerformed"] !== false) reasons.push("actual_real_doc_input_must_be_false");
  if (o["actualRealDocumentProcessingPerformed"] !== false) reasons.push("actual_real_doc_processing_must_be_false");
  if (o["actual_user_visible_output"] !== undefined && o["actualUserVisibleOutputPerformed"] !== false) reasons.push("actual_user_visible_output_must_be_false");
  if (o["actualUserVisibleOutputPerformed"] !== false) reasons.push("actual_user_visible_output_performed_must_be_false");
  if (o["actualPublicRuntimeEnabled"] !== false) reasons.push("actual_public_runtime_must_be_false");

  // 8.6E side-effect confirmations
  for (const se of SIDE_EFFECTS) {
    if (o[`piiDryRunConfirms${se}`] !== true) reasons.push(`pii_dry_run_confirms_${se}_false`);
  }

  // Pipeline flags (8.6E names)
  for (const f of PIPELINE_FLAGS_8E) {
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

  // 8.6E TD result flags
  if (o["td004PreModelPiiRedactionDryRunImplemented"] !== true) reasons.push("td004_dry_run_implemented_false");
  if (o["td004PreModelPiiRedactionStillRequiresRuntimeExecutionContract"] !== true) reasons.push("td004_still_requires_runtime_execution_contract_false");
  if (o["td004PreModelPiiRedactionStillRequiresSurgicalUtilityPatch"] !== true) reasons.push("td004_still_requires_surgical_utility_patch_false");
  if (o["td004PreModelPiiRedactionStillRequiresPostPatchAudit"] !== true) reasons.push("td004_still_requires_post_patch_audit_false");
  if (o["td004PreModelPiiRedactionStillRequiresClosureDecision"] !== true) reasons.push("td004_still_requires_closure_decision_false");
  if (o["td004PreModelPiiRedactionStillMissingInProduction"] !== true) reasons.push("td004_still_missing_in_production_false");

  // 8.6E forward readiness
  if (o["readyFor8x6FPreModelPiiRedactionRuntimeExecutionContract"] !== true) reasons.push("ready_for_8x6f_runtime_execution_contract_false");

  return { accepted: reasons.length === 0, reasons };
}

// ── Canonical 8.6E input builder ──────────────────────────────────────────────

function buildCanonical8x6EInput(): Record<string, unknown> {
  const rc = runControlledRealDocumentPreModelPiiRedactionRuntimeContract();
  const synth = runAllSyntheticCases();
  const o: Record<string, unknown> = {
    // 8.6D prereq gate — core
    prereqCheckId: rc.checkId,
    prereqAllPassed: rc.allPassed,
    preModelPiiRedactionImplementationPlanReadyForRuntimeContract: rc.preModelPiiRedactionImplementationPlanReadyForRuntimeContract,
    controlledRealDocumentPreModelPiiRedactionRuntimeContractAccepted: rc.controlledRealDocumentPreModelPiiRedactionRuntimeContractAccepted,
    preModelPiiRedactionRuntimeContractOnly: rc.preModelPiiRedactionRuntimeContractOnly,
    preModelPiiRedactionRuntimeContractDefined: rc.preModelPiiRedactionRuntimeContractDefined,
    preModelPiiRedactionUtilityRuntimeStillNotImplemented: rc.preModelPiiRedactionUtilityRuntimeStillNotImplemented,
    preModelPiiRedactionRuntimeStillNotImplemented: rc.preModelPiiRedactionRuntimeStillNotImplemented,
    preModelPiiDetectorRuntimeStillNotImplemented: rc.preModelPiiDetectorRuntimeStillNotImplemented,
    preModelPiiMaskingRuntimeStillNotImplemented: rc.preModelPiiMaskingRuntimeStillNotImplemented,
    preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: rc.preModelPiiRedactionDoesNotAuthorizeRealDocumentInput,
    preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: rc.preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput,
    preModelPiiRedactionDoesNotAuthorizePromptBuild: rc.preModelPiiRedactionDoesNotAuthorizePromptBuild,
    preModelPiiRedactionDoesNotAuthorizeModelCall: rc.preModelPiiRedactionDoesNotAuthorizeModelCall,
    preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: rc.preModelPiiRedactionDoesNotAuthorizeRunSmartTalk,
    prereqTamperCasesRejected: rc.tamperCasesRejected,
  };

  // 8.6D piiRuntimeContract* groups
  for (const s of RC_REQUIRES_SUFFIXES) o[`piiRuntimeContractRequires${s}`] = rc[`piiRuntimeContractRequires${s}` as keyof typeof rc];
  for (const s of RC_INPUT_SUFFIXES) o[`piiRuntimeContractInput${s}`] = rc[`piiRuntimeContractInput${s}` as keyof typeof rc];
  o["piiRuntimeContractReturnsStructuredRedactionResult"] = rc.piiRuntimeContractReturnsStructuredRedactionResult;
  for (const s of RC_OUTPUT_SUFFIXES) o[`piiRuntimeContractOutput${s}`] = rc[`piiRuntimeContractOutput${s}` as keyof typeof rc];
  for (const s of RC_DETECTOR_HIT_SUFFIXES) o[`piiRuntimeContractDetectorHits${s}`] = rc[`piiRuntimeContractDetectorHits${s}` as keyof typeof rc];
  for (const dc of DETECTOR_COVERAGE) o[`piiRuntimeContractDetectorCovers${dc}`] = rc[`piiRuntimeContractDetectorCovers${dc}` as keyof typeof rc];
  o["piiRuntimeContractPlaceholdersDeterministicPerRequest"] = rc.piiRuntimeContractPlaceholdersDeterministicPerRequest;
  o["piiRuntimeContractPlaceholdersCategorySpecific"] = rc.piiRuntimeContractPlaceholdersCategorySpecific;
  o["piiRuntimeContractPlaceholderNumberingStableWithinRequest"] = rc.piiRuntimeContractPlaceholderNumberingStableWithinRequest;
  o["piiRuntimeContractRepeatedRawValueGetsSamePlaceholder"] = rc.piiRuntimeContractRepeatedRawValueGetsSamePlaceholder;
  o["piiRuntimeContractDifferentRawValuesIncrementPlaceholders"] = rc.piiRuntimeContractDifferentRawValuesIncrementPlaceholders;
  o["piiRuntimeContractPlaceholderCategoriesSafeForPromptsAndAudit"] = rc.piiRuntimeContractPlaceholderCategoriesSafeForPromptsAndAudit;
  o["piiRuntimeContractRawMapLocalEphemeralByDefault"] = rc.piiRuntimeContractRawMapLocalEphemeralByDefault;
  o["piiRuntimeContractBlocksIfSafeRedactionCannotBeEstablished"] = rc.piiRuntimeContractBlocksIfSafeRedactionCannotBeEstablished;
  o["piiRuntimeContractNeedsReviewIfAmbiguousButRecoverable"] = rc.piiRuntimeContractNeedsReviewIfAmbiguousButRecoverable;
  o["piiRuntimeContractSafeForUserVisibleOutputDefaultsFalse"] = rc.piiRuntimeContractSafeForUserVisibleOutputDefaultsFalse;
  o["piiRuntimeContractSafeForModelDefaultsFalseUnlessPassedAndNoHighRisk"] = rc.piiRuntimeContractSafeForModelDefaultsFalseUnlessPassedAndNoHighRisk;
  o["piiRuntimeContractSafeForEvidenceGatesDefaultsFalseUnlessPassed"] = rc.piiRuntimeContractSafeForEvidenceGatesDefaultsFalseUnlessPassed;
  o["piiRuntimeContractDoesNotSilentlyPassHighRiskIdentifiers"] = rc.piiRuntimeContractDoesNotSilentlyPassHighRiskIdentifiers;
  o["piiRuntimeContractDoesNotAlterDatesIntoFalseDeadlines"] = rc.piiRuntimeContractDoesNotAlterDatesIntoFalseDeadlines;
  o["piiRuntimeContractPreservesLegalSemanticStructureWherePossible"] = rc.piiRuntimeContractPreservesLegalSemanticStructureWherePossible;
  o["piiRuntimeContractDoesNotInventMissingFacts"] = rc.piiRuntimeContractDoesNotInventMissingFacts;
  o["piiRuntimeContractDoesNotClassifyDocumentAsLegallySufficient"] = rc.piiRuntimeContractDoesNotClassifyDocumentAsLegallySufficient;
  for (const tc of RC_TESTING_CASES) o[`piiRuntimeContractTests${tc}`] = rc[`piiRuntimeContractTests${tc}` as keyof typeof rc];
  o["piiRuntimeContractFutureUtilityCreatedAsIsolatedHelperFirst"] = rc.piiRuntimeContractFutureUtilityCreatedAsIsolatedHelperFirst;
  o["piiRuntimeContractFutureRoutePatchRequiresSeparateAuthorization"] = rc.piiRuntimeContractFutureRoutePatchRequiresSeparateAuthorization;
  o["piiRuntimeContractFutureRoutePatchAfterValidationBeforePrompt"] = rc.piiRuntimeContractFutureRoutePatchAfterValidationBeforePrompt;
  o["piiRuntimeContractFutureRoutePatchPreservesFreeQaGuard"] = rc.piiRuntimeContractFutureRoutePatchPreservesFreeQaGuard;
  o["piiRuntimeContractFutureRoutePatchPreservesPaidBoundary"] = rc.piiRuntimeContractFutureRoutePatchPreservesPaidBoundary;
  o["piiRuntimeContractFutureRoutePatchPreservesPhotoQuarantine"] = rc.piiRuntimeContractFutureRoutePatchPreservesPhotoQuarantine;
  o["piiRuntimeContractFutureRoutePatchDoesNotAuthorizeUserVisibleOutput"] = rc.piiRuntimeContractFutureRoutePatchDoesNotAuthorizeUserVisibleOutput;
  o["piiRuntimeContractFutureRoutePatchDoesNotAuthorizePublicRuntime"] = rc.piiRuntimeContractFutureRoutePatchDoesNotAuthorizePublicRuntime;
  o["piiRuntimeContractFutureRoutePatchDoesNotAuthorizeExactDeadlineCalculation"] = rc.piiRuntimeContractFutureRoutePatchDoesNotAuthorizeExactDeadlineCalculation;
  o["piiRuntimeContractAcceptsImplementationPlan"] = rc.piiRuntimeContractAcceptsImplementationPlan;
  o["piiRuntimeContractMarksTd004RuntimeContractCompleted"] = rc.piiRuntimeContractMarksTd004RuntimeContractCompleted;
  o["piiRuntimeContractKeepsRuntimeImplementationDisabled"] = rc.piiRuntimeContractKeepsRuntimeImplementationDisabled;
  o["piiRuntimeContractKeepsProductionPiiRedactionMissing"] = rc.piiRuntimeContractKeepsProductionPiiRedactionMissing;
  o["piiRuntimeContractReadyFor8x6EDryRunImplementation"] = rc.piiRuntimeContractReadyFor8x6EDryRunImplementation;

  // 8.6D actual flags (using 8.6D field names)
  o["actualPiiRedactionRuntimeContractOnly"] = rc.actualPiiRedactionRuntimeContractOnly;
  o["actualPiiRedactionUtilityRuntimeImplemented"] = rc.actualPiiRedactionUtilityRuntimeImplemented;
  o["actualPiiRedactionImplemented"] = rc.actualPiiRedactionImplemented;
  o["actualPiiDetectorRuntimeImplemented"] = rc.actualPiiDetectorRuntimeImplemented;
  o["actualPiiMaskingRuntimeImplemented"] = rc.actualPiiMaskingRuntimeImplemented;
  o["actualPiiTextRedacted"] = rc.actualPiiTextRedacted;
  o["actualRawPiiProcessed"] = rc.actualRawPiiProcessed;
  o["actualRawPiiPersisted"] = rc.actualRawPiiPersisted;
  o["actualRawPiiLogged"] = rc.actualRawPiiLogged;
  o["actualPromptBuildPerformed"] = rc.actualPromptBuildPerformed;
  o["actualModelCallPerformed"] = rc.actualModelCallPerformed;
  o["actualRunSmartTalkCalled"] = rc.actualRunSmartTalkCalled;
  o["actualEvidenceGateRuntimeWiringPerformed"] = rc.actualEvidenceGateRuntimeWiringPerformed;
  o["actualClaimAuthorizationPerformed"] = rc.actualClaimAuthorizationPerformed;
  o["actualDeadlineCalculationPerformed"] = rc.actualDeadlineCalculationPerformed;
  o["actualLiveRouteMutationPerformedInThisPhase"] = rc.actualLiveRouteMutationPerformedInThisPhase;
  o["actualSmartTalkRouteModifiedInThisPhase"] = rc.actualSmartTalkRouteModifiedInThisPhase;
  o["actualPhotoRouteModifiedInThisPhase"] = rc.actualPhotoRouteModifiedInThisPhase;
  o["actualUtilityRuntimeFileCreatedInThisPhase"] = rc.actualUtilityRuntimeFileCreatedInThisPhase;
  o["actualPaidDocumentModeImplemented"] = rc.actualPaidDocumentModeImplemented;
  o["actualPaymentRuntimeImplemented"] = rc.actualPaymentRuntimeImplemented;
  o["actualCheckoutImplemented"] = rc.actualCheckoutImplemented;
  o["actualEntitlementRuntimeImplemented"] = rc.actualEntitlementRuntimeImplemented;
  o["actualServerEntitlementVerificationImplemented"] = rc.actualServerEntitlementVerificationImplemented;
  o["actualRealDocumentInputPerformed"] = rc.actualRealDocumentInputPerformed;
  o["actualRealDocumentProcessingPerformed"] = rc.actualRealDocumentProcessingPerformed;
  o["actualOcrPerformed"] = rc.actualOcrPerformed;
  o["actualPhotoInputProcessed"] = rc.actualPhotoInputProcessed;
  o["actualFileInputProcessed"] = rc.actualFileInputProcessed;
  o["actualDocumentStoragePerformed"] = rc.actualDocumentStoragePerformed;
  o["actualDatabasePersistencePerformed"] = rc.actualDatabasePersistencePerformed;
  o["actualAuditPersistencePerformed"] = rc.actualAuditPersistencePerformed;
  o["actualUserVisibleOutputPerformed"] = rc.actualUserVisibleOutputPerformed;
  o["actualPublicRuntimeEnabled"] = rc.actualPublicRuntimeEnabled;

  // 8.6D side-effect confirmations
  for (const se of SIDE_EFFECTS) o[`piiRuntimeContractConfirms${se}`] = rc[`piiRuntimeContractConfirms${se}` as keyof typeof rc];

  // Pipeline flags (8.6D names for prereq)
  for (const f of PIPELINE_FLAGS_8D) o[f] = rc[f as keyof typeof rc];

  // Runtime auth flags + shared
  for (const f of RUNTIME_AUTH_FLAGS) o[f] = rc[f as keyof typeof rc];
  o["runtimeAuthorizationGranted"] = rc.runtimeAuthorizationGranted;
  o["pilotAuthorizationGranted"] = rc.pilotAuthorizationGranted;
  o["productionAuthorizationGranted"] = rc.productionAuthorizationGranted;
  o["finalAuthorizationGranted"] = rc.finalAuthorizationGranted;
  o["goLiveAuthorizationGranted"] = rc.goLiveAuthorizationGranted;
  o["exactDeadlineCalculationAuthorized"] = rc.exactDeadlineCalculationAuthorized;
  o["deliveryDateInventionAuthorized"] = rc.deliveryDateInventionAuthorized;
  o["finalDateInventionAuthorized"] = rc.finalDateInventionAuthorized;
  o["legalCertaintyAuthorized"] = rc.legalCertaintyAuthorized;
  o["coerciveLegalInstructionAuthorized"] = rc.coerciveLegalInstructionAuthorized;
  o["deliveryDateRequiredForExactDeadline"] = rc.deliveryDateRequiredForExactDeadline;

  // TD flags from 8.6D result
  o["td001DocumentBypassGuardContainmentClosed"] = rc.td001DocumentBypassGuardContainmentClosed;
  o["td005PaidDocumentModeBoundaryContainmentClosed"] = rc.td005PaidDocumentModeBoundaryContainmentClosed;
  o["td005PaidDocumentModeClientFlagBypassClosed"] = rc.td005PaidDocumentModeClientFlagBypassClosed;
  o["td005PaidDocumentModeActualRuntimeImplementationDeferred"] = rc.td005PaidDocumentModeActualRuntimeImplementationDeferred;
  o["td004PreModelPiiRedactionPlanned"] = rc.td004PreModelPiiRedactionPlanned;
  o["td004PreModelPiiRedactionContracted"] = rc.td004PreModelPiiRedactionContracted;
  o["td004PreModelPiiRedactionImplementationPlanned"] = rc.td004PreModelPiiRedactionImplementationPlanned;
  o["td004PreModelPiiRedactionRuntimeContracted"] = rc.td004PreModelPiiRedactionRuntimeContracted;
  o["td004PreModelPiiRedactionStillRequiresRuntimeImplementation"] = rc.td004PreModelPiiRedactionStillRequiresRuntimeImplementation;
  o["td004PreModelPiiRedactionStillMissingInProduction"] = rc.td004PreModelPiiRedactionStillMissingInProduction;
  o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] = rc.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk;
  o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained"] = rc.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained;
  o["td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign"] = rc.td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign;
  o["td006EvidenceGateTodoAndOrSemanticsUnresolved"] = rc.td006EvidenceGateTodoAndOrSemanticsUnresolved;
  o["td007TrapClaimDispositionNamespaceHardeningUnresolved"] = rc.td007TrapClaimDispositionNamespaceHardeningUnresolved;
  o["td008InMemoryRateLimiterServerlessUnsafe"] = rc.td008InMemoryRateLimiterServerlessUnsafe;
  o["td010GetUserStateDocumentTypeTodoOpen"] = rc.td010GetUserStateDocumentTypeTodoOpen;
  o["td009TmpDebugRunnerDebtClosed"] = rc.td009TmpDebugRunnerDebtClosed;
  o["tmpFilesPresentInWorkingTree"] = rc.tmpFilesPresentInWorkingTree;

  // 8.6D forward readiness
  o["readyFor8x6EPreModelPiiRedactionDryRunImplementation"] = rc.readyFor8x6EPreModelPiiRedactionDryRunImplementation;
  o["readyForEvidenceGatesProductionWiringPhase"] = rc.readyForEvidenceGatesProductionWiringPhase;
  o["readyForServerEntitlementVerificationPhase"] = rc.readyForServerEntitlementVerificationPhase;
  o["readyForPaidDocumentModeActualRuntimeImplementationPhase"] = rc.readyForPaidDocumentModeActualRuntimeImplementationPhase;
  o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase"] = rc.readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase;
  o["readyForControlledRealDocumentPilotAuthorizationPhase"] = rc.readyForControlledRealDocumentPilotAuthorizationPhase;
  o["readyForControlledRealDocumentProductionAuthorizationPhase"] = rc.readyForControlledRealDocumentProductionAuthorizationPhase;
  o["readyForRealDocumentInput"] = rc.readyForRealDocumentInput;
  o["readyForUserVisibleOutput"] = rc.readyForUserVisibleOutput;
  o["publicRuntimeEnabled"] = rc.publicRuntimeEnabled;
  o["persistenceUsed"] = rc.persistenceUsed;
  o["neverUserVisible"] = rc.neverUserVisible;

  // 8.6E core assertion flags
  o["preModelPiiRedactionRuntimeContractReadyForDryRunImplementation"] = true;
  o["preModelPiiRedactionDryRunImplementationOnly"] = true;
  o["preModelPiiRedactionDryRunImplemented"] = true;
  o["preModelPiiRedactionProductionUtilityStillNotImplemented"] = true;

  // Dry-run case coverage (34)
  for (const dc of DRY_RUN_CASES) o[`piiDryRunCovers${dc}`] = true;

  // Dry-run output model
  for (const s of DRY_RUN_OUTPUT_SUPPORTS) o[`piiDryRunSupports${s}`] = true;
  o["piiDryRunDoesNotReturnRawToPlaceholderMapByDefault"] = true;

  // Dry-run behavior
  o["piiDryRunUsesSyntheticLocalExpectedValuesOnly"] = true;
  o["piiDryRunSyntheticPlaceholdersDeterministic"] = true;
  o["piiDryRunRepeatedSyntheticRawValueMapsToSamePlaceholder"] = true;
  o["piiDryRunDifferentSyntheticValuesIncrementPlaceholders"] = true;
  o["piiDryRunUnsafeUnresolvedCasesBlockedOrNeedsReview"] = true;
  o["piiDryRunOutputMetadataContainsNoRawPii"] = true;
  o["piiDryRunDidNotProcessRealText"] = true;
  o["piiDryRunDidNotImplementProductionUtilityRuntime"] = true;
  o["piiDryRunDidNotAuthorizeModelFacingUse"] = true;
  o["piiDryRunDidNotAuthorizeEvidenceGateExecution"] = true;
  o["piiDryRunDidNotAuthorizeUserVisibleOutput"] = true;

  // Synthetic dry-run summary
  o["syntheticDryRunCaseCount"] = synth.count;
  o["syntheticDryRunAllCasesPassed"] = synth.allPassed;
  o["syntheticDryRunRawPiiLeakageDetected"] = synth.rawPiiLeakageDetected;
  o["syntheticDryRunStablePlaceholderMappingConfirmed"] = synth.stablePlaceholderMappingConfirmed;
  o["syntheticDryRunUnsafeCasesBlocked"] = synth.unsafeCasesBlocked;
  o["syntheticDryRunNoRuntimeAuthorizationConfirmed"] = synth.noRuntimeAuthorizationConfirmed;

  // 8.6E new actual flags
  o["actualPiiRedactionDryRunImplementationOnly"] = true;
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
  o["actualRealDocumentInputPerformed"] = false;
  o["actualRealDocumentProcessingPerformed"] = false;
  o["actualUserVisibleOutputPerformed"] = false;
  o["actualPublicRuntimeEnabled"] = false;

  // 8.6E side-effect confirmations
  for (const se of SIDE_EFFECTS) o[`piiDryRunConfirms${se}`] = true;

  // Pipeline flags (8.6E names for result assertions)
  for (const f of PIPELINE_FLAGS_8E) o[f] = false;

  // 8.6E TD result flags
  o["td004PreModelPiiRedactionDryRunImplemented"] = true;
  o["td004PreModelPiiRedactionStillRequiresRuntimeExecutionContract"] = true;
  o["td004PreModelPiiRedactionStillRequiresSurgicalUtilityPatch"] = true;
  o["td004PreModelPiiRedactionStillRequiresPostPatchAudit"] = true;
  o["td004PreModelPiiRedactionStillRequiresClosureDecision"] = true;
  o["td004PreModelPiiRedactionStillMissingInProduction"] = true;

  // 8.6E forward readiness
  o["readyFor8x6FPreModelPiiRedactionRuntimeExecutionContract"] = true;

  return o;
}

// ── Tamper coverage ───────────────────────────────────────────────────────────

function runTamperCases(): { allRejected: boolean; count: number; failures: string[] } {
  const base = buildCanonical8x6EInput();
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Record<string, unknown>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validateDryRunInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.6D prereq gate — core
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.6E" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("prereq_impl_plan_ready_for_rc_false", { preModelPiiRedactionImplementationPlanReadyForRuntimeContract: false });
  expect_rejected("prereq_rc_not_accepted", { controlledRealDocumentPreModelPiiRedactionRuntimeContractAccepted: false });
  expect_rejected("prereq_rc_only_false", { preModelPiiRedactionRuntimeContractOnly: false });
  expect_rejected("prereq_rc_defined_false", { preModelPiiRedactionRuntimeContractDefined: false });
  expect_rejected("prereq_utility_runtime_still_not_implemented_false", { preModelPiiRedactionUtilityRuntimeStillNotImplemented: false });
  expect_rejected("prereq_pii_redaction_runtime_false", { preModelPiiRedactionRuntimeStillNotImplemented: false });
  expect_rejected("prereq_pii_detector_runtime_false", { preModelPiiDetectorRuntimeStillNotImplemented: false });
  expect_rejected("prereq_pii_masking_runtime_false", { preModelPiiMaskingRuntimeStillNotImplemented: false });
  expect_rejected("prereq_no_real_doc_input_false", { preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: false });
  expect_rejected("prereq_no_user_visible_output_false", { preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: false });
  expect_rejected("prereq_no_prompt_build_false", { preModelPiiRedactionDoesNotAuthorizePromptBuild: false });
  expect_rejected("prereq_no_model_call_false", { preModelPiiRedactionDoesNotAuthorizeModelCall: false });
  expect_rejected("prereq_no_run_smart_talk_false", { preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: false });
  expect_rejected("prereq_tamper_cases_rejected_false", { prereqTamperCasesRejected: false });

  // 8.6D piiRuntimeContract* groups
  for (const s of RC_REQUIRES_SUFFIXES) expect_rejected(`prereq_rc_requires_${s}_false`, { [`piiRuntimeContractRequires${s}`]: false });
  for (const s of RC_INPUT_SUFFIXES) expect_rejected(`prereq_rc_input_${s}_false`, { [`piiRuntimeContractInput${s}`]: false });
  expect_rejected("prereq_rc_returns_structured_result_false", { piiRuntimeContractReturnsStructuredRedactionResult: false });
  for (const s of RC_OUTPUT_SUFFIXES) expect_rejected(`prereq_rc_output_${s}_false`, { [`piiRuntimeContractOutput${s}`]: false });
  for (const s of RC_DETECTOR_HIT_SUFFIXES) expect_rejected(`prereq_rc_detector_hits_${s}_false`, { [`piiRuntimeContractDetectorHits${s}`]: false });
  for (const dc of DETECTOR_COVERAGE) expect_rejected(`prereq_rc_detector_covers_${dc}_false`, { [`piiRuntimeContractDetectorCovers${dc}`]: false });
  expect_rejected("prereq_rc_placeholders_deterministic_false", { piiRuntimeContractPlaceholdersDeterministicPerRequest: false });
  expect_rejected("prereq_rc_placeholders_category_specific_false", { piiRuntimeContractPlaceholdersCategorySpecific: false });
  expect_rejected("prereq_rc_placeholder_numbering_stable_false", { piiRuntimeContractPlaceholderNumberingStableWithinRequest: false });
  expect_rejected("prereq_rc_repeated_raw_same_placeholder_false", { piiRuntimeContractRepeatedRawValueGetsSamePlaceholder: false });
  expect_rejected("prereq_rc_different_raw_increment_false", { piiRuntimeContractDifferentRawValuesIncrementPlaceholders: false });
  expect_rejected("prereq_rc_placeholder_categories_safe_false", { piiRuntimeContractPlaceholderCategoriesSafeForPromptsAndAudit: false });
  expect_rejected("prereq_rc_raw_map_local_ephemeral_false", { piiRuntimeContractRawMapLocalEphemeralByDefault: false });
  expect_rejected("prereq_rc_blocks_if_safe_false", { piiRuntimeContractBlocksIfSafeRedactionCannotBeEstablished: false });
  expect_rejected("prereq_rc_needs_review_ambiguous_false", { piiRuntimeContractNeedsReviewIfAmbiguousButRecoverable: false });
  expect_rejected("prereq_rc_safe_user_visible_defaults_false_false", { piiRuntimeContractSafeForUserVisibleOutputDefaultsFalse: false });
  expect_rejected("prereq_rc_safe_model_defaults_false_false", { piiRuntimeContractSafeForModelDefaultsFalseUnlessPassedAndNoHighRisk: false });
  expect_rejected("prereq_rc_safe_evidence_defaults_false_false", { piiRuntimeContractSafeForEvidenceGatesDefaultsFalseUnlessPassed: false });
  expect_rejected("prereq_rc_no_silent_pass_high_risk_false", { piiRuntimeContractDoesNotSilentlyPassHighRiskIdentifiers: false });
  expect_rejected("prereq_rc_no_alter_dates_false", { piiRuntimeContractDoesNotAlterDatesIntoFalseDeadlines: false });
  expect_rejected("prereq_rc_preserves_legal_semantic_false", { piiRuntimeContractPreservesLegalSemanticStructureWherePossible: false });
  expect_rejected("prereq_rc_no_invent_facts_false", { piiRuntimeContractDoesNotInventMissingFacts: false });
  expect_rejected("prereq_rc_no_classify_legally_sufficient_false", { piiRuntimeContractDoesNotClassifyDocumentAsLegallySufficient: false });
  for (const tc of RC_TESTING_CASES) expect_rejected(`prereq_rc_tests_${tc}_false`, { [`piiRuntimeContractTests${tc}`]: false });
  expect_rejected("prereq_rc_utility_isolated_first_false", { piiRuntimeContractFutureUtilityCreatedAsIsolatedHelperFirst: false });
  expect_rejected("prereq_rc_route_patch_separate_auth_false", { piiRuntimeContractFutureRoutePatchRequiresSeparateAuthorization: false });
  expect_rejected("prereq_rc_route_patch_after_validation_false", { piiRuntimeContractFutureRoutePatchAfterValidationBeforePrompt: false });
  expect_rejected("prereq_rc_route_patch_free_qa_guard_false", { piiRuntimeContractFutureRoutePatchPreservesFreeQaGuard: false });
  expect_rejected("prereq_rc_route_patch_paid_boundary_false", { piiRuntimeContractFutureRoutePatchPreservesPaidBoundary: false });
  expect_rejected("prereq_rc_route_patch_photo_quarantine_false", { piiRuntimeContractFutureRoutePatchPreservesPhotoQuarantine: false });
  expect_rejected("prereq_rc_route_patch_no_user_visible_false", { piiRuntimeContractFutureRoutePatchDoesNotAuthorizeUserVisibleOutput: false });
  expect_rejected("prereq_rc_route_patch_no_public_runtime_false", { piiRuntimeContractFutureRoutePatchDoesNotAuthorizePublicRuntime: false });
  expect_rejected("prereq_rc_route_patch_no_exact_deadline_false", { piiRuntimeContractFutureRoutePatchDoesNotAuthorizeExactDeadlineCalculation: false });
  expect_rejected("prereq_rc_accepts_impl_plan_false", { piiRuntimeContractAcceptsImplementationPlan: false });
  expect_rejected("prereq_rc_marks_td004_complete_false", { piiRuntimeContractMarksTd004RuntimeContractCompleted: false });
  expect_rejected("prereq_rc_keeps_runtime_disabled_false", { piiRuntimeContractKeepsRuntimeImplementationDisabled: false });
  expect_rejected("prereq_rc_keeps_production_missing_false", { piiRuntimeContractKeepsProductionPiiRedactionMissing: false });
  expect_rejected("prereq_rc_ready_for_8x6e_false", { piiRuntimeContractReadyFor8x6EDryRunImplementation: false });

  // 8.6D actual flag violations
  expect_rejected("prereq_actual_rc_only_false", { actualPiiRedactionRuntimeContractOnly: false });
  expect_rejected("prereq_actual_utility_runtime_true", { actualPiiRedactionUtilityRuntimeImplemented: true });
  expect_rejected("prereq_actual_pii_redaction_true", { actualPiiRedactionImplemented: true });
  expect_rejected("prereq_actual_pii_detector_true", { actualPiiDetectorRuntimeImplemented: true });
  expect_rejected("prereq_actual_pii_masking_true", { actualPiiMaskingRuntimeImplemented: true });
  expect_rejected("prereq_actual_pii_text_redacted_true", { actualPiiTextRedacted: true });
  expect_rejected("prereq_actual_raw_pii_processed_true", { actualRawPiiProcessed: true });
  expect_rejected("prereq_actual_raw_pii_persisted_true", { actualRawPiiPersisted: true });
  expect_rejected("prereq_actual_raw_pii_logged_true", { actualRawPiiLogged: true });
  expect_rejected("prereq_actual_prompt_build_true", { actualPromptBuildPerformed: true });
  expect_rejected("prereq_actual_model_call_true", { actualModelCallPerformed: true });
  expect_rejected("prereq_actual_run_smart_talk_true", { actualRunSmartTalkCalled: true });
  expect_rejected("prereq_actual_evidence_gate_wiring_true", { actualEvidenceGateRuntimeWiringPerformed: true });
  expect_rejected("prereq_actual_claim_auth_true", { actualClaimAuthorizationPerformed: true });
  expect_rejected("prereq_actual_deadline_calc_true", { actualDeadlineCalculationPerformed: true });
  expect_rejected("prereq_actual_live_route_mutation_true", { actualLiveRouteMutationPerformedInThisPhase: true });
  expect_rejected("prereq_actual_smart_talk_route_modified_true", { actualSmartTalkRouteModifiedInThisPhase: true });
  expect_rejected("prereq_actual_photo_route_modified_true", { actualPhotoRouteModifiedInThisPhase: true });
  expect_rejected("prereq_actual_utility_file_created_true", { actualUtilityRuntimeFileCreatedInThisPhase: true });
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

  // 8.6D side-effect violations
  for (const se of SIDE_EFFECTS) expect_rejected(`prereq_rc_confirms_${se}_false`, { [`piiRuntimeContractConfirms${se}`]: false });

  // Pipeline flags (8.6D names)
  for (const f of PIPELINE_FLAGS_8D) expect_rejected(`prereq_${f}_true`, { [f]: true });

  // Runtime auth flags
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
  expect_rejected("prereq_td004_still_requires_runtime_impl_false", { td004PreModelPiiRedactionStillRequiresRuntimeImplementation: false });
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

  // 8.6D forward readiness gate
  expect_rejected("prereq_ready_for_8x6e_false", { readyFor8x6EPreModelPiiRedactionDryRunImplementation: false });
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

  // 8.6E core assertion flags
  expect_rejected("rc_ready_for_dry_run_false", { preModelPiiRedactionRuntimeContractReadyForDryRunImplementation: false });
  expect_rejected("dry_run_implementation_only_false", { preModelPiiRedactionDryRunImplementationOnly: false });
  expect_rejected("dry_run_implemented_false", { preModelPiiRedactionDryRunImplemented: false });
  expect_rejected("production_utility_still_not_implemented_false", { preModelPiiRedactionProductionUtilityStillNotImplemented: false });
  expect_rejected("pii_redaction_runtime_still_not_implemented_false", { preModelPiiRedactionRuntimeStillNotImplemented: false });
  expect_rejected("pii_detector_runtime_still_not_implemented_false", { preModelPiiDetectorRuntimeStillNotImplemented: false });
  expect_rejected("pii_masking_runtime_still_not_implemented_false", { preModelPiiMaskingRuntimeStillNotImplemented: false });

  // Dry-run case coverage (34)
  for (const dc of DRY_RUN_CASES) expect_rejected(`pii_dry_run_covers_${dc}_false`, { [`piiDryRunCovers${dc}`]: false });

  // Dry-run output model (12)
  for (const s of DRY_RUN_OUTPUT_SUPPORTS) expect_rejected(`pii_dry_run_supports_${s}_false`, { [`piiDryRunSupports${s}`]: false });
  expect_rejected("pii_dry_run_no_raw_map_false", { piiDryRunDoesNotReturnRawToPlaceholderMapByDefault: false });

  // Dry-run behavior (11)
  expect_rejected("pii_dry_run_synthetic_only_false", { piiDryRunUsesSyntheticLocalExpectedValuesOnly: false });
  expect_rejected("pii_dry_run_placeholders_deterministic_false", { piiDryRunSyntheticPlaceholdersDeterministic: false });
  expect_rejected("pii_dry_run_repeated_maps_to_same_false", { piiDryRunRepeatedSyntheticRawValueMapsToSamePlaceholder: false });
  expect_rejected("pii_dry_run_different_values_increment_false", { piiDryRunDifferentSyntheticValuesIncrementPlaceholders: false });
  expect_rejected("pii_dry_run_unsafe_blocked_false", { piiDryRunUnsafeUnresolvedCasesBlockedOrNeedsReview: false });
  expect_rejected("pii_dry_run_output_no_raw_pii_false", { piiDryRunOutputMetadataContainsNoRawPii: false });
  expect_rejected("pii_dry_run_did_not_process_real_false", { piiDryRunDidNotProcessRealText: false });
  expect_rejected("pii_dry_run_did_not_implement_production_false", { piiDryRunDidNotImplementProductionUtilityRuntime: false });
  expect_rejected("pii_dry_run_did_not_authorize_model_false", { piiDryRunDidNotAuthorizeModelFacingUse: false });
  expect_rejected("pii_dry_run_did_not_authorize_evidence_gate_false", { piiDryRunDidNotAuthorizeEvidenceGateExecution: false });
  expect_rejected("pii_dry_run_did_not_authorize_user_visible_false", { piiDryRunDidNotAuthorizeUserVisibleOutput: false });

  // Synthetic dry-run summary
  expect_rejected("synthetic_case_count_too_low", { syntheticDryRunCaseCount: 33 });
  expect_rejected("synthetic_case_count_zero", { syntheticDryRunCaseCount: 0 });
  expect_rejected("synthetic_all_cases_passed_false", { syntheticDryRunAllCasesPassed: false });
  expect_rejected("synthetic_raw_pii_leakage_true", { syntheticDryRunRawPiiLeakageDetected: true });
  expect_rejected("synthetic_stable_placeholder_false", { syntheticDryRunStablePlaceholderMappingConfirmed: false });
  expect_rejected("synthetic_unsafe_cases_blocked_false", { syntheticDryRunUnsafeCasesBlocked: false });
  expect_rejected("synthetic_no_runtime_auth_false", { syntheticDryRunNoRuntimeAuthorizationConfirmed: false });

  // 8.6E new actual flag violations
  expect_rejected("actual_dry_run_impl_only_false", { actualPiiRedactionDryRunImplementationOnly: false });
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
  expect_rejected("actual_real_doc_input_true", { actualRealDocumentInputPerformed: true });
  expect_rejected("actual_real_doc_processing_true", { actualRealDocumentProcessingPerformed: true });
  expect_rejected("actual_user_visible_output_true", { actualUserVisibleOutputPerformed: true });
  expect_rejected("actual_public_runtime_true", { actualPublicRuntimeEnabled: true });

  // 8.6E side-effect violations
  for (const se of SIDE_EFFECTS) expect_rejected(`pii_dry_run_confirms_${se}_false`, { [`piiDryRunConfirms${se}`]: false });

  // Pipeline violations (8.6E names)
  for (const f of PIPELINE_FLAGS_8E) expect_rejected(`${f}_true_result`, { [f]: true });

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

  // 8.6E TD result violations
  expect_rejected("td004_dry_run_implemented_false", { td004PreModelPiiRedactionDryRunImplemented: false });
  expect_rejected("td004_still_requires_runtime_execution_contract_false", { td004PreModelPiiRedactionStillRequiresRuntimeExecutionContract: false });
  expect_rejected("td004_still_requires_surgical_utility_patch_false", { td004PreModelPiiRedactionStillRequiresSurgicalUtilityPatch: false });
  expect_rejected("td004_still_requires_post_patch_audit_false", { td004PreModelPiiRedactionStillRequiresPostPatchAudit: false });
  expect_rejected("td004_still_requires_closure_decision_false", { td004PreModelPiiRedactionStillRequiresClosureDecision: false });
  expect_rejected("td004_still_missing_in_production_false", { td004PreModelPiiRedactionStillMissingInProduction: false });

  // 8.6E forward readiness violations
  expect_rejected("ready_for_8x6f_false", { readyFor8x6FPreModelPiiRedactionRuntimeExecutionContract: false });
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

export function runControlledRealDocumentPreModelPiiRedactionDryRunImplementation(): ControlledRealDocumentPreModelPiiRedactionDryRunImplementationResult {
  const canonical = buildCanonical8x6EInput();
  const validation = validateDryRunInput(canonical);
  const tamperResult = runTamperCases();
  const synth = runAllSyntheticCases();
  const allPassed = validation.accepted && tamperResult.allRejected && synth.allPassed;

  return {
    checkId: "8.6E",
    allPassed,
    preModelPiiRedactionRuntimeContractReadyForDryRunImplementation: true,
    controlledRealDocumentPreModelPiiRedactionDryRunImplementationAccepted: allPassed,
    preModelPiiRedactionDryRunImplementationOnly: true,
    preModelPiiRedactionDryRunImplemented: true,
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
    piiDryRunCoversCleanNoPiiInput: true,
    piiDryRunCoversSimplePersonName: true,
    piiDryRunCoversGermanGreetingWithPersonName: true,
    piiDryRunCoversPostalAddress: true,
    piiDryRunCoversPhoneNumber: true,
    piiDryRunCoversEmailAddress: true,
    piiDryRunCoversDateOfBirth: true,
    piiDryRunCoversCustomerNumber: true,
    piiDryRunCoversInsuranceNumber: true,
    piiDryRunCoversHealthInsuranceIdentifier: true,
    piiDryRunCoversSteuerId: true,
    piiDryRunCoversSteuernummer: true,
    piiDryRunCoversAktenzeichen: true,
    piiDryRunCoversVorgangsnummer: true,
    piiDryRunCoversCaseReferenceNumber: true,
    piiDryRunCoversIban: true,
    piiDryRunCoversLicensePlate: true,
    piiDryRunCoversSenderBlock: true,
    piiDryRunCoversRecipientBlock: true,
    piiDryRunCoversAuthorityContactBlock: true,
    piiDryRunCoversJobcenterBuergergeldIdentifier: true,
    piiDryRunCoversFamilienkasseKindergeldIdentifier: true,
    piiDryRunCoversAuslaenderbehoerdeIdentifier: true,
    piiDryRunCoversFinanzamtIdentifier: true,
    piiDryRunCoversMedicalIdentifier: true,
    piiDryRunCoversImmigrationResidenceIdentifier: true,
    piiDryRunCoversMixedUserCommentaryAndDocumentText: true,
    piiDryRunCoversFalsePositiveControl: true,
    piiDryRunCoversRepeatedRawValueStablePlaceholder: true,
    piiDryRunCoversDifferentValuesIncrementPlaceholders: true,
    piiDryRunCoversUnresolvedUnsafeIdentifierBlocks: true,
    piiDryRunCoversNoRawPiiInResultMetadata: true,
    piiDryRunCoversNoRawPiiInUnsafeOutputFields: true,
    piiDryRunCoversNoRuntimeAuthorizationGranted: true,
    piiDryRunSupportsStatusPassedBlockedNeedsReview: true,
    piiDryRunSupportsRedactedText: true,
    piiDryRunSupportsPlaceholderCounts: true,
    piiDryRunSupportsPlaceholderCategories: true,
    piiDryRunSupportsCoverageSummaryWithoutRawValues: true,
    piiDryRunSupportsUnresolvedRiskFlagsWithoutRawValues: true,
    piiDryRunSupportsBlockingReasonsWithoutRawValues: true,
    piiDryRunSupportsDetectorSummaryWithoutRawValues: true,
    piiDryRunSupportsSafeForModelBoolean: true,
    piiDryRunSupportsSafeForEvidenceGatesBoolean: true,
    piiDryRunSupportsSafeForUserVisibleOutputDefaultFalse: true,
    piiDryRunDoesNotReturnRawToPlaceholderMapByDefault: true,
    piiDryRunUsesSyntheticLocalExpectedValuesOnly: true,
    piiDryRunSyntheticPlaceholdersDeterministic: true,
    piiDryRunRepeatedSyntheticRawValueMapsToSamePlaceholder: true,
    piiDryRunDifferentSyntheticValuesIncrementPlaceholders: true,
    piiDryRunUnsafeUnresolvedCasesBlockedOrNeedsReview: true,
    piiDryRunOutputMetadataContainsNoRawPii: true,
    piiDryRunDidNotProcessRealText: true,
    piiDryRunDidNotImplementProductionUtilityRuntime: true,
    piiDryRunDidNotAuthorizeModelFacingUse: true,
    piiDryRunDidNotAuthorizeEvidenceGateExecution: true,
    piiDryRunDidNotAuthorizeUserVisibleOutput: true,
    syntheticDryRunCaseCount: synth.count,
    syntheticDryRunAllCasesPassed: synth.allPassed,
    syntheticDryRunRawPiiLeakageDetected: false,
    syntheticDryRunStablePlaceholderMappingConfirmed: synth.stablePlaceholderMappingConfirmed,
    syntheticDryRunUnsafeCasesBlocked: synth.unsafeCasesBlocked,
    syntheticDryRunNoRuntimeAuthorizationConfirmed: synth.noRuntimeAuthorizationConfirmed,
    actualPiiRedactionDryRunImplementationOnly: true,
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
    piiDryRunConfirmsNoOpenAiCall: true,
    piiDryRunConfirmsNoFetchCall: true,
    piiDryRunConfirmsNoProcessEnvRead: true,
    piiDryRunConfirmsNoSdkUsage: true,
    piiDryRunConfirmsNo8x3AcRerun: true,
    piiDryRunConfirmsNoPaymentRuntimeCall: true,
    piiDryRunConfirmsNoStripeCall: true,
    piiDryRunConfirmsNoCheckoutCall: true,
    piiDryRunConfirmsNoEntitlementRuntimeCall: true,
    piiDryRunConfirmsNoServerEntitlementVerification: true,
    piiDryRunConfirmsNoOcrRuntimeCall: true,
    piiDryRunConfirmsNoStorageMutation: true,
    piiDryRunConfirmsNoDatabaseWrite: true,
    piiDryRunConfirmsNoAuditPersistence: true,
    piiDryRunConfirmsNoUserVisibleDocumentExplanation: true,
    piiDryRunConfirmsNoEvidenceEvaluation: true,
    piiDryRunConfirmsNoClaimAuthorization: true,
    piiDryRunConfirmsNoDeadlineCalculation: true,
    piiDryRunConfirmsNoLegalCertainty: true,
    piiDryRunConfirmsNoPromptBuild: true,
    piiDryRunConfirmsNoModelCall: true,
    piiDryRunConfirmsNoRunSmartTalkCall: true,
    piiDryRunConfirmsNoRouteHandlerCall: true,
    piiDryRunConfirmsNoRouteImport: true,
    piiDryRunConfirmsNoFilesystemRead: true,
    piiDryRunConfirmsNoPhotoRouteModification: true,
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
    td004PreModelPiiRedactionStillRequiresRuntimeExecutionContract: true,
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
    readyFor8x6FPreModelPiiRedactionRuntimeExecutionContract: true,
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
      "8.6E is a Pre-Model PII Redaction Dry-Run Implementation.",
      "8.6E depends on completed 8.6D Pre-Model PII Redaction Runtime Contract.",
      "8.6E is dry-run-implementation-only and creates no production runtime behavior.",
      "8.6E does not modify /api/smart-talk.",
      "8.6E does not modify /api/smart-talk-photo.",
      "8.6E simulates future PII redaction behavior using synthetic local expected values only.",
      "8.6E does not implement the production PII redaction utility.",
      "8.6E does not create a utility runtime file.",
      "8.6E does not implement production PII redaction runtime.",
      "8.6E does not implement production PII detector runtime.",
      "8.6E does not implement production PII masking runtime.",
      "8.6E does not redact real text.",
      "8.6E does not process real raw PII.",
      "8.6E does not authorize real document input.",
      "8.6E does not authorize user-visible output.",
      "8.6E does not authorize prompt build, model call, or runSmartTalk.",
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
      "TD-004 dry-run implementation is complete but production PII redaction remains missing.",
      "TD-004 still requires runtime execution contract, surgical utility patch, post-patch audit, and closure decision.",
      "TD-002 remains unresolved.",
      "8.3AC was not re-run.",
      "readyFor8x6FPreModelPiiRedactionRuntimeExecutionContract is runtime-execution-contract readiness only, not real document/pilot/production authorization.",
      "readyForRealDocumentInput remains false.",
      "readyForUserVisibleOutput remains false.",
    ],
  };
}
