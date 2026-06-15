/**
 * Live LLM Boundary Contract Types (Phase 8.3B).
 *
 * Defines the typed boundary contract for future governance-controlled AI
 * runtime access to a live LLM. This contract:
 *   - explicitly isolates the existing public Smart Talk live runtime
 *     (Branch C / run-smart-talk.ts / OCR) from the governance chain
 *   - defines the only allowed provider (OpenAI) and model policy
 *   - defines preconditions, output-handling requirements, and checklist
 *     that must be satisfied before any live LLM call may occur in a future
 *     governance-controlled context
 *   - sets the only positive readiness flag: `readyForRedactedInputForwardingContract`
 *
 * ISOLATION NOTE:
 *   The existing public Smart Talk Branch C already calls OpenAI through
 *   `lib/vaylo/smart-talk/run-smart-talk.ts`. That path is the legacy/current
 *   production live runtime and is NOT authorized for the governance-controlled
 *   chain by this contract. `publicBranchCAuthorizedForGovernanceChain`,
 *   `runSmartTalkAuthorizedForGovernanceChain`, and
 *   `extractTextFromImageAuthorizedForGovernanceChain` are all literal `false`.
 *
 * This module does NOT:
 * - read process.env
 * - call any live LLM (OpenAI, Gemini, Anthropic, or any other)
 * - import, call, or wrap run-smart-talk.ts
 * - import, call, or wrap extract-text-from-image.ts
 * - call fetch() or make HTTP requests
 * - authorize live LLM runtime
 * - generate AI output
 * - process actual user input or forward raw input
 * - authorize user-visible output
 * - persist audit records or evidence records
 * - store actual user content or env/secret values
 * - implement database or storage behavior
 * - modify DB/storage schema or API routes
 * - authorize pilotRunNow
 * - authorize public launch
 * - authorize persistence
 * - modify UI
 *
 * Safety invariants on LiveLlmBoundaryContractInput (all literal):
 * - existingPublicRouteBranchCIdentified: true
 * - existingRunSmartTalkLiveRuntimeIdentified: true
 * - existingOcrLiveRuntimeIdentified: true
 * - publicBranchCAuthorizedForGovernanceChain: false
 * - runSmartTalkAuthorizedForGovernanceChain: false
 * - extractTextFromImageAuthorizedForGovernanceChain: false
 * - envVarNamesAttestedOnly: true
 * - envValuesReadByContract: false
 * - envValuesPrinted: false
 * - envValuesStored: false
 * - secretsPrinted: false
 * - secretsStored: false
 * - liveLLMCallPerformed: false
 * - aiOutputGenerated: false
 * - modelOutputStored: false
 * - realInputProcessedByContract: false
 * - rawInputForwarded: false
 * - userVisibleOutputAllowed: false
 * - containsRealUserInput: false
 * - containsRawInputText: false
 * - containsRedactedText: false
 * - containsFullDraftText: false
 * - containsModelOutput: false
 * - containsSecret: false
 * - containsEnvValue: false
 * - containsApiKey: false
 * - containsUserPii: false
 * - containsDocumentContent: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - publicRuntimeEnabled: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 *
 * Safety invariants on LiveLlmBoundaryContractResult (all literal):
 * - readyForLiveLLMRuntime: false
 * - readyForConnectedAiRuntimeExecution: false
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForPersistence: false
 * - publicBranchCAuthorizedForGovernanceChain: false
 * - runSmartTalkAuthorizedForGovernanceChain: false
 * - extractTextFromImageAuthorizedForGovernanceChain: false
 * - liveLLMCalled: false
 * - aiOutputGenerated: false
 * - modelOutputStored: false
 * - realInputProcessed: false
 * - rawInputForwarded: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - publicRuntimeEnabled: false
 * - emittedToUserNow: false
 * - envValuesReadByContract: false
 * - envValuesPrinted: false
 * - envValuesStored: false
 * - secretsPrinted: false
 * - secretsStored: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - apiRouteModifiedByLiveLlmBoundary: false
 * - existingRuntimeModifiedByBoundary: false
 * - uiTouched: false
 * - databaseOrStorageModifiedByBoundary: false
 * - neverUserVisible: true
 */

// ── Contract status ───────────────────────────────────────────────────────────

export type LiveLlmBoundaryContractStatus = "valid" | "rejected";

// ── Existing runtime isolation status ────────────────────────────────────────

export type ExistingSmartTalkRuntimeIsolationStatus =
  | "isolated_legacy_current_runtime"
  | "unsafe_overlap_detected";

// ── Provider ──────────────────────────────────────────────────────────────────

export type LiveLlmProvider = "openai";

// ── Model policy ──────────────────────────────────────────────────────────────

export type LiveLlmModelPolicy =
  | "gpt_4o_mini_allowed_for_controlled_internal_test_only"
  | "model_must_come_from_allowlisted_env_name"
  | "model_must_not_be_hardcoded_by_governance_runtime"
  | "ocr_model_not_allowed_for_text_pilot_boundary";

// ── Preconditions ─────────────────────────────────────────────────────────────

export type LiveLlmBoundaryPrecondition =
  | "connected_ai_authorization_plan_ready"
  | "existing_public_branch_c_isolated"
  | "public_smart_talk_route_not_called_by_governance_test"
  | "run_smart_talk_not_called_by_boundary_contract"
  | "extract_text_from_image_not_called_by_boundary_contract"
  | "env_var_names_only_attested"
  | "no_env_values_read_by_contract"
  | "redacted_input_forwarding_contract_required_next"
  | "raw_input_forwarding_blocked"
  | "ai_output_governance_recheck_required"
  | "manual_review_required_before_user_visible_output"
  | "user_visible_output_blocked"
  | "persistence_blocked"
  | "public_runtime_blocked"
  | "rate_limit_policy_required_later"
  | "cost_limit_policy_required_later";

// ── Output handling requirements ──────────────────────────────────────────────

export type LiveLlmOutputHandlingRequirement =
  | "ai_output_must_be_treated_as_untrusted"
  | "ai_output_must_enter_governance_recheck"
  | "ai_output_must_not_be_user_visible_directly"
  | "ai_output_must_not_be_persisted"
  | "ai_output_must_not_update_dna"
  | "ai_output_must_not_be_saved_offline"
  | "ai_output_must_not_claim_legal_certainty"
  | "ai_output_must_not_calculate_deadline_without_evidence"
  | "ai_output_must_preserve_uncertainty"
  | "ai_output_requires_manual_review_before_display";

// ── Checklist items ───────────────────────────────────────────────────────────

export type LiveLlmBoundaryChecklistItem =
  | "existing_runtime_isolation_reviewed"
  | "provider_allowlist_reviewed"
  | "model_policy_reviewed"
  | "preconditions_reviewed"
  | "output_handling_reviewed"
  | "redacted_input_contract_required"
  | "governance_recheck_contract_required"
  | "manual_review_contract_required"
  | "public_route_branch_c_not_authorized"
  | "run_smart_talk_not_authorized_for_governance_chain_yet"
  | "ocr_runtime_not_authorized_for_text_pilot_yet"
  | "no_live_llm_call_performed"
  | "no_ai_output_generated"
  | "no_real_input_processed"
  | "no_raw_input_forwarded"
  | "no_user_visible_output_allowed"
  | "no_persistence_performed"
  | "no_public_runtime_enabled";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type LiveLlmBoundaryRejectionReason =
  | "connected_ai_authorization_plan_not_ready"
  | "existing_runtime_not_isolated"
  | "public_branch_c_authorized_too_early"
  | "run_smart_talk_authorized_too_early"
  | "ocr_runtime_authorized_too_early"
  | "missing_provider_allowlist"
  | "missing_model_policy"
  | "missing_precondition"
  | "missing_output_handling_requirement"
  | "missing_required_checklist_item"
  | "live_llm_call_claim_detected"
  | "ai_output_generation_claim_detected"
  | "model_output_storage_claim_detected"
  | "real_input_processed_claim_detected"
  | "raw_input_forwarding_claim_detected"
  | "user_visible_output_claim_detected"
  | "persistence_claim_detected"
  | "public_runtime_claim_detected"
  | "env_value_read_claim_detected"
  | "secret_or_api_key_claim_detected"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_boundary_note_detected";

// ── Contract input ────────────────────────────────────────────────────────────

/**
 * Input for the Live LLM Boundary Contract validation.
 *
 * The three `...Identified` flags (`existingPublicRouteBranchCIdentified`,
 * `existingRunSmartTalkLiveRuntimeIdentified`, `existingOcrLiveRuntimeIdentified`)
 * are literal `true` to document that the existing production runtime is known
 * and has been explicitly reviewed. The corresponding `...AuthorizedForGovernanceChain`
 * flags are literal `false` to confirm that none of those paths are yet
 * authorized for the governance-controlled AI chain.
 *
 * `envVarNamesAttestedOnly: true` confirms only env variable **names** are
 * referenced (never values). All `envValues*` and `secrets*` flags are
 * literal `false`.
 */
export interface LiveLlmBoundaryContractInput {
  readonly contractId: string;
  readonly epochId: "8.3B";
  readonly previousPhaseId: "8.3A";

  readonly connectedAiAuthorizationPlanReady: boolean;

  readonly existingRuntimeIsolationStatus: ExistingSmartTalkRuntimeIsolationStatus;
  readonly existingPublicRouteBranchCIdentified: true;
  readonly existingRunSmartTalkLiveRuntimeIdentified: true;
  readonly existingOcrLiveRuntimeIdentified: true;

  readonly publicBranchCAuthorizedForGovernanceChain: false;
  readonly runSmartTalkAuthorizedForGovernanceChain: false;
  readonly extractTextFromImageAuthorizedForGovernanceChain: false;

  readonly allowedProviders: readonly LiveLlmProvider[];
  readonly modelPolicies: readonly LiveLlmModelPolicy[];
  readonly preconditions: readonly LiveLlmBoundaryPrecondition[];
  readonly outputHandlingRequirements: readonly LiveLlmOutputHandlingRequirement[];
  readonly checklistConfirmed: readonly LiveLlmBoundaryChecklistItem[];

  readonly envVarNamesAttestedOnly: true;
  readonly envValuesReadByContract: false;
  readonly envValuesPrinted: false;
  readonly envValuesStored: false;
  readonly secretsPrinted: false;
  readonly secretsStored: false;

  readonly liveLLMCallPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly realInputProcessedByContract: false;
  readonly rawInputForwarded: false;
  readonly userVisibleOutputAllowed: false;

  readonly operatorBoundaryAcknowledgment: string;
  readonly reviewerBoundaryAcknowledgment: string;
  readonly notes: readonly string[];

  readonly containsRealUserInput: false;
  readonly containsRawInputText: false;
  readonly containsRedactedText: false;
  readonly containsFullDraftText: false;
  readonly containsModelOutput: false;
  readonly containsSecret: false;
  readonly containsEnvValue: false;
  readonly containsApiKey: false;
  readonly containsUserPii: false;
  readonly containsDocumentContent: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly emittedToUserNow: false;

  readonly neverUserVisible: true;
}

// ── Contract result ───────────────────────────────────────────────────────────

/**
 * Result of validating a `LiveLlmBoundaryContractInput`.
 *
 * `readyForRedactedInputForwardingContract` is `true` only when
 * `accepted === true`. All execution, launch, persistence, and existing-runtime
 * authorization flags are always literal `false`.
 *
 * `safeBoundaryMetadata` stores only safe counts and the isolation status
 * string — no env values, secrets, API keys, user content, or model output.
 */
export interface LiveLlmBoundaryContractResult {
  readonly contractId: string;
  readonly epochId: "8.3B";
  readonly status: LiveLlmBoundaryContractStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly LiveLlmBoundaryRejectionReason[];

  readonly safeBoundaryMetadata: {
    readonly existingRuntimeIsolationStatus: ExistingSmartTalkRuntimeIsolationStatus;
    readonly allowedProviderCount: number;
    readonly modelPolicyCount: number;
    readonly preconditionCount: number;
    readonly outputHandlingRequirementCount: number;
    readonly checklistPassedCount: number;
  };

  readonly readyForRedactedInputForwardingContract: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly publicBranchCAuthorizedForGovernanceChain: false;
  readonly runSmartTalkAuthorizedForGovernanceChain: false;
  readonly extractTextFromImageAuthorizedForGovernanceChain: false;

  readonly liveLLMCalled: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly realInputProcessed: false;
  readonly rawInputForwarded: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly emittedToUserNow: false;

  readonly envValuesReadByContract: false;
  readonly envValuesPrinted: false;
  readonly envValuesStored: false;
  readonly secretsPrinted: false;
  readonly secretsStored: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly apiRouteModifiedByLiveLlmBoundary: false;
  readonly existingRuntimeModifiedByBoundary: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByBoundary: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runLiveLlmBoundaryContractCheck()` (Phase 8.3B).
 *
 * `allPassed` is true when all three sub-checks pass:
 * 1. The 8.3A connected AI authorization plan dependency is verified.
 * 2. The synthetic live LLM boundary input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForRedactedInputForwardingContract` is the only positive gate set
 * by this contract. All other runtime/execution/launch/persistence flags are
 * always literal `false`. The existing public Smart Talk Branch C /
 * run-smart-talk.ts / OCR runtime are never authorized by this contract.
 */
export interface LiveLlmBoundaryContractCheckResult {
  readonly checkId: "8.3B";
  readonly allPassed: boolean;
  readonly connectedAiAuthorizationPlanReady: boolean;
  readonly syntheticLiveLlmBoundaryAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForRedactedInputForwardingContract: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly publicBranchCAuthorizedForGovernanceChain: false;
  readonly runSmartTalkAuthorizedForGovernanceChain: false;
  readonly extractTextFromImageAuthorizedForGovernanceChain: false;

  readonly liveLLMCalled: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly realInputProcessed: false;
  readonly rawInputForwarded: false;
  readonly persistenceUsed: false;
  readonly publicRuntimeEnabled: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ────────────────────────────────────────────────────────

/** Allowed live LLM providers for the governance-controlled AI runtime. */
export const ALLOWED_LIVE_LLM_PROVIDERS: readonly LiveLlmProvider[] = [
  "openai",
] as const;

/** All model policies that must be confirmed in a valid boundary input. */
export const REQUIRED_LIVE_LLM_MODEL_POLICIES: readonly LiveLlmModelPolicy[] =
  [
    "gpt_4o_mini_allowed_for_controlled_internal_test_only",
    "model_must_come_from_allowlisted_env_name",
    "model_must_not_be_hardcoded_by_governance_runtime",
    "ocr_model_not_allowed_for_text_pilot_boundary",
  ] as const;

/** All preconditions that must be confirmed in a valid boundary input. */
export const REQUIRED_LIVE_LLM_BOUNDARY_PRECONDITIONS: readonly LiveLlmBoundaryPrecondition[] =
  [
    "connected_ai_authorization_plan_ready",
    "existing_public_branch_c_isolated",
    "public_smart_talk_route_not_called_by_governance_test",
    "run_smart_talk_not_called_by_boundary_contract",
    "extract_text_from_image_not_called_by_boundary_contract",
    "env_var_names_only_attested",
    "no_env_values_read_by_contract",
    "redacted_input_forwarding_contract_required_next",
    "raw_input_forwarding_blocked",
    "ai_output_governance_recheck_required",
    "manual_review_required_before_user_visible_output",
    "user_visible_output_blocked",
    "persistence_blocked",
    "public_runtime_blocked",
    "rate_limit_policy_required_later",
    "cost_limit_policy_required_later",
  ] as const;

/** All output handling requirements that must be confirmed in a valid boundary input. */
export const REQUIRED_LIVE_LLM_OUTPUT_HANDLING_REQUIREMENTS: readonly LiveLlmOutputHandlingRequirement[] =
  [
    "ai_output_must_be_treated_as_untrusted",
    "ai_output_must_enter_governance_recheck",
    "ai_output_must_not_be_user_visible_directly",
    "ai_output_must_not_be_persisted",
    "ai_output_must_not_update_dna",
    "ai_output_must_not_be_saved_offline",
    "ai_output_must_not_claim_legal_certainty",
    "ai_output_must_not_calculate_deadline_without_evidence",
    "ai_output_must_preserve_uncertainty",
    "ai_output_requires_manual_review_before_display",
  ] as const;

/** All checklist items that must be confirmed in a valid boundary input. */
export const REQUIRED_LIVE_LLM_BOUNDARY_CHECKLIST: readonly LiveLlmBoundaryChecklistItem[] =
  [
    "existing_runtime_isolation_reviewed",
    "provider_allowlist_reviewed",
    "model_policy_reviewed",
    "preconditions_reviewed",
    "output_handling_reviewed",
    "redacted_input_contract_required",
    "governance_recheck_contract_required",
    "manual_review_contract_required",
    "public_route_branch_c_not_authorized",
    "run_smart_talk_not_authorized_for_governance_chain_yet",
    "ocr_runtime_not_authorized_for_text_pilot_yet",
    "no_live_llm_call_performed",
    "no_ai_output_generated",
    "no_real_input_processed",
    "no_raw_input_forwarded",
    "no_user_visible_output_allowed",
    "no_persistence_performed",
    "no_public_runtime_enabled",
  ] as const;

/**
 * Required statements that must appear in both operator and reviewer
 * live LLM boundary acknowledgments.
 */
export const REQUIRED_LIVE_LLM_BOUNDARY_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that the existing public Smart Talk live runtime is isolated from the governance-controlled AI runtime.",
    "I acknowledge that public Branch C must not be called by governance tests before boundary completion.",
    "I acknowledge that live LLM runtime remains blocked by this contract.",
    "I acknowledge that AI output must be rechecked by governance before any user-visible output.",
    "I acknowledge that persistence and public launch remain blocked.",
  ] as const;

/**
 * Strings that must never appear in any boundary field or notes. Covers
 * API keys, env assignments, raw/draft text markers, stored-content phrases,
 * PII, document markers, sensitive personal markers, and high-risk legal
 * markers.
 */
export const FORBIDDEN_LIVE_LLM_BOUNDARY_STRINGS: readonly string[] = [
  "sk-",
  "OPENAI_API_KEY=",
  "VAYLO_INTERNAL_RUNTIME_SECRET=",
  "process.env",
  "apiKey",
  "internalSecret",
  "rawInputText",
  "redactedText",
  "fullDraftText",
  "modelOutput",
  "stored user input",
  "stored redacted text",
  "stored model output",
  "IBAN",
  "Steuer-ID",
  "Aktenzeichen",
  "Sehr geehrter",
  "BG-Nr",
  "john@example.com",
  "+49 170 1234567",
  "Name:",
  "Adresse:",
  "Geburtsdatum:",
  "Kind:",
  "Mietvertrag",
  "Kündigung",
  "Abschiebung",
] as const;
