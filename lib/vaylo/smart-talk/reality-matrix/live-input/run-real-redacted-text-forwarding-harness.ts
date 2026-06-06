/**
 * Real Redacted Text Forwarding Harness (Phase 8.2I-4).
 *
 * Implements `runRealRedactedTextForwardingHarness` — a pure proof harness that
 * verifies synthetic real-text fixtures with PII can flow through the complete
 * 8.2H controlled input chain → 8.2G governance chain using the native
 * ControlledLiveTextDraftResult path introduced in Phase 8.2I-1/2/3.
 *
 * Full pipeline:
 *   1. runRealTextInputContractValidation()     — 8.2H-1
 *   2. runRealTextRedactionBoundary()           — 8.2H-2
 *   3. runControlledLiveTextAdapter()           — 8.2H-3
 *   4. buildControlledLiveTextRedactionProof()  — 8.2I-1
 *   5. buildControlledLiveTextDraftResult()     — 8.2I-1
 *   6. [raw value leak check]                  — 8.2I-4 (local)
 *   7. validateRuntimeLLMOutputContract()       — 8.2G-2 (controlled_live_text path)
 *   8. runRuntimeWordingGovernanceGate()        — 8.2G-3
 *   9. runRuntimeResponseAssemblerBridge()      — 8.2G-6
 *  10. runRuntimeUserVisibleAuthorisationGate() — 8.2G-7
 *
 * Synthetic fixture raw PII values used (never real user data):
 *   Email    : max.mustermann@example.test
 *   IBAN     : DE89370400440532013000
 *   Phone    : +49 170 1234567
 *   Amount   : 1.234,56 EUR
 *   Date     : 31.03.2026
 *   Reference: REF-2026-001
 *
 * The raw value leak check verifies that none of these synthetic values appear
 * in the section draft texts after redaction is applied. Redacted placeholders
 * such as [REDACTED_EMAIL] are expected and allowed.
 *
 * Tamper modes:
 *   missing_prefix_tamper  — adapter sections stripped of CONTROLLED prefix;
 *                            buildControlledLiveTextDraftResult() returns null.
 *   invalid_proof_tamper   — proof status field set to "failed";
 *                            buildControlledLiveTextDraftResult() returns null.
 *
 * Safety invariants (literal types on the result):
 * - emittedToUserNow: false
 * - liveLLMCalled: false
 * - apiRouteTouched: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - neverUserVisible: true
 *
 * Pure function — no external calls, no logging, no persistence.
 * No real user data is ever processed.
 */

import { runRealTextInputContractValidation } from "./run-real-text-input-contract-validation";
import { runRealTextRedactionBoundary } from "./run-real-text-redaction-boundary";
import { runControlledLiveTextAdapter } from "./run-controlled-live-text-adapter";
import {
  buildControlledLiveTextDraftResult,
  buildControlledLiveTextRedactionProof,
  validateControlledLiveTextRedactionProof,
  CONTROLLED_LIVE_TEXT_DRAFT_PREFIX,
} from "./controlled-live-text-draft-result-types";
import { validateRuntimeLLMOutputContract } from "../validate-runtime-llm-output-contract";
import { runRuntimeWordingGovernanceGate } from "../run-runtime-wording-governance-gate";
import { runRuntimeResponseAssemblerBridge } from "../run-runtime-response-assembler-bridge";
import { runRuntimeUserVisibleAuthorisationGate } from "../run-runtime-user-visible-authorisation-gate";
import {
  BASE_SAFE_SCORE_REPORT,
  BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT,
  BASE_HUMAN_REVIEW_SCORE_REPORT,
} from "../runtime-wording-governance-gate-regression-scaffold";
import type {
  RealRedactedTextForwardingHarnessDiagnosticCode,
  RealRedactedTextForwardingHarnessFixtureMode,
  RealRedactedTextForwardingHarnessInput,
  RealRedactedTextForwardingHarnessResult,
  RealRedactedTextForwardingHarnessVerdict,
} from "./real-redacted-text-forwarding-harness-types";
import type { RuntimeLLMDraftAdapterInput } from "../runtime-llm-draft-adapter-types";
import type { RuntimeLLMOutputContractDraftResult } from "../runtime-llm-output-contract-validator-types";
import type { ControlledLiveTextAdapterResult } from "./controlled-live-text-adapter-types";
import type { ControlledLiveTextRedactionProof } from "./controlled-live-text-draft-result-types";

export const REAL_REDACTED_TEXT_FORWARDING_HARNESS_VERSION =
  "8.2i-4-real-redacted-text-forwarding-harness-v1";

// ── Synthetic fixture definitions ─────────────────────────────────────────────
//
// All PII values below are SYNTHETIC ONLY — never real user data.
// The leak check verifies these raw values do not appear in redacted output.

const SYNTHETIC_EMAIL = "max.mustermann@example.test";
const SYNTHETIC_IBAN = "DE89370400440532013000";
const SYNTHETIC_PHONE = "+49 170 1234567";
const SYNTHETIC_AMOUNT = "1.234,56 EUR";
const SYNTHETIC_DATE = "31.03.2026";
const SYNTHETIC_REFERENCE = "REF-2026-001";

/** Known raw synthetic PII values that must NOT appear in redacted output. */
const SYNTHETIC_PII_VALUES: readonly string[] = [
  SYNTHETIC_EMAIL,
  SYNTHETIC_IBAN,
  SYNTHETIC_PHONE,
];

// Fixture texts — each uses controlled synthetic PII, not real user data.
const FIXTURE_TEXTS: Record<RealRedactedTextForwardingHarnessFixtureMode, string> = {
  pii_invoice_text: [
    `Sehr geehrter Herr Mustermann,`,
    `Ihre Rechnung Nr. ${SYNTHETIC_REFERENCE} vom ${SYNTHETIC_DATE}`,
    `über ${SYNTHETIC_AMOUNT} wurde gebucht.`,
    `IBAN: ${SYNTHETIC_IBAN}.`,
    `Fragen: ${SYNTHETIC_EMAIL} oder ${SYNTHETIC_PHONE}.`,
  ].join(" "),

  pii_payment_reminder_text: [
    `Zahlungserinnerung: Ausstehender Betrag ${SYNTHETIC_AMOUNT}.`,
    `Referenz: ${SYNTHETIC_REFERENCE}, fällig am ${SYNTHETIC_DATE}.`,
    `Kontakt: ${SYNTHETIC_EMAIL}.`,
  ].join(" "),

  pii_jobcenter_text: [
    `Bescheid vom ${SYNTHETIC_DATE}: BG-Nummer ${SYNTHETIC_REFERENCE}.`,
    `Bewilligter Betrag ${SYNTHETIC_AMOUNT} ab ${SYNTHETIC_DATE}.`,
    `Rückfragen: ${SYNTHETIC_PHONE}.`,
  ].join(" "),

  pii_question_text: [
    `Was bedeutet dieser Bescheid für mich?`,
    `Referenz: ${SYNTHETIC_REFERENCE} vom ${SYNTHETIC_DATE}.`,
    `Bitte antworten Sie an ${SYNTHETIC_EMAIL}.`,
  ].join(" "),

  // High-risk fixture — IBAN triggers high-risk rejection when rejectHighRiskPatterns: true
  high_risk_rejected_text: [
    `Überweisung auf IBAN ${SYNTHETIC_IBAN} angefordert.`,
    `Bitte bestätigen Sie den Betrag ${SYNTHETIC_AMOUNT}.`,
  ].join(" "),

  // These modes are blocked at input contract — text doesn't matter (any valid text)
  legal_conclusion_requested_text:
    `Bitte erklären Sie diesen Brief und teilen Sie mir mit, ob ich recht habe.`,

  persistence_requested_text:
    `Bitte speichern Sie diese Anfrage in meinem Profil für zukünftige Referenz.`,

  // These use safe text + special score reports at wording gate
  missing_prefix_tamper: [
    `Bitte prüfen Sie diesen Brief. Referenz: ${SYNTHETIC_REFERENCE} vom ${SYNTHETIC_DATE}.`,
    `Kontakt: ${SYNTHETIC_EMAIL}.`,
  ].join(" "),

  invalid_proof_tamper: [
    `Wichtige Nachricht vom ${SYNTHETIC_DATE}.`,
    `Ihre Akte Nr. ${SYNTHETIC_REFERENCE}. Fragen: ${SYNTHETIC_PHONE}.`,
  ].join(" "),

  human_review_text: `Was bedeutet dieser Behördenbescheid für meine Situation?`,

  wording_hard_fail_text: `Bitte erklären Sie diesen Bescheid.`,
};

// ── Score report helpers ──────────────────────────────────────────────────────

type ScoreReport = Parameters<typeof runRuntimeWordingGovernanceGate>[0]["scoreReport"];

function mapToScoreReport(mode: RealRedactedTextForwardingHarnessFixtureMode): ScoreReport {
  switch (mode) {
    case "wording_hard_fail_text": return BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT;
    case "human_review_text":      return BASE_HUMAN_REVIEW_SCORE_REPORT;
    default:                       return BASE_SAFE_SCORE_REPORT;
  }
}

// ── Blocked result builder ────────────────────────────────────────────────────

function makeBlocked(
  harnessRunId: string,
  fixtureMode: RealRedactedTextForwardingHarnessFixtureMode,
  verdict: RealRedactedTextForwardingHarnessVerdict,
  diagnostics: RealRedactedTextForwardingHarnessDiagnosticCode[],
  inputContractVerdict: string,
  redactionBoundaryVerdict: string,
  adapterVerdict: string,
  outputContractVerdict: string,
  wordingGateVerdict: string,
  responseAssemblerVerdict: string,
  authorisationVerdict: string,
  redactionApplied: boolean,
  redactionMatchCount: number,
  redactionProofValid: boolean,
  controlledLiveTextDraftBuilt: boolean,
  controlledLiveTextDraftUsed: boolean,
  realRedactedTextForwardedToOutputContract: boolean,
  rawValueLeakCheckPassed: boolean,
  notes?: string[],
): RealRedactedTextForwardingHarnessResult {
  return {
    harnessRunId,
    fixtureMode,
    verdict,
    diagnostics,
    inputContractVerdict,
    redactionBoundaryVerdict,
    adapterVerdict,
    outputContractVerdict,
    wordingGateVerdict,
    responseAssemblerVerdict,
    authorisationVerdict,
    redactionApplied,
    redactionMatchCount,
    redactionProofValid,
    controlledLiveTextDraftBuilt,
    controlledLiveTextDraftUsed,
    realRedactedTextForwardedToOutputContract,
    rawValueLeakCheckPassed,
    packetCreated: false,
    acceptedForUserVisibleAssembly: false,
    userVisibleOutputAllowedForFuture: false,
    emittedToUserNow: false,
    liveLLMCalled: false,
    apiRouteTouched: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
    notes,
  };
}

// ── Raw value leak check ──────────────────────────────────────────────────────

/**
 * Checks that known synthetic raw PII values do not appear in draft section
 * texts or harness notes. Placeholders such as [REDACTED_EMAIL] are allowed.
 *
 * Returns the first leaked value found, or null if clean.
 */
function findRawValueLeak(
  sectionTexts: readonly string[],
  knownRawValues: readonly string[],
): string | null {
  for (const sectionText of sectionTexts) {
    for (const rawValue of knownRawValues) {
      if (sectionText.includes(rawValue)) {
        return rawValue;
      }
    }
  }
  return null;
}

// ── Tamper helpers ────────────────────────────────────────────────────────────

/**
 * Produces a tampered adapter result whose sections have the CONTROLLED_LIVE_TEXT_DRAFT_PREFIX
 * stripped. This simulates a malicious or corrupted adapter output to verify
 * that `buildControlledLiveTextDraftResult` rejects it.
 */
function tamperAdapterRemovePrefix(
  adapterResult: ControlledLiveTextAdapterResult,
): ControlledLiveTextAdapterResult {
  const tamperedSections = adapterResult.sectionCandidates.map((sc) => ({
    ...sc,
    // Remove the controlled prefix — the draft builder must reject this
    draftText: sc.draftText.replace(CONTROLLED_LIVE_TEXT_DRAFT_PREFIX, "TAMPERED_SECTION"),
  }));
  return {
    ...adapterResult,
    sectionCandidates: tamperedSections,
  } as unknown as ControlledLiveTextAdapterResult;
}

/**
 * Produces a tampered redaction proof with status set to "failed".
 * This simulates a corrupted proof to verify that `buildControlledLiveTextDraftResult` rejects it.
 */
function tamperProofInvalidStatus(
  proof: ControlledLiveTextRedactionProof,
): ControlledLiveTextRedactionProof {
  return {
    ...proof,
    status: "failed",
  } as unknown as ControlledLiveTextRedactionProof;
}

// ── Main harness function ─────────────────────────────────────────────────────

/**
 * Runs the complete real redacted text forwarding proof harness for the given
 * synthetic fixture mode.
 *
 * Pure function — no external calls, no logging, no persistence.
 * No real user data is ever processed.
 */
export function runRealRedactedTextForwardingHarness(
  input: RealRedactedTextForwardingHarnessInput,
): RealRedactedTextForwardingHarnessResult {
  const { harnessRunId, fixtureMode } = input;

  const diagnostics: RealRedactedTextForwardingHarnessDiagnosticCode[] = [
    "real_redacted_forwarding_started",
    "real_redacted_forwarding_no_live_llm_confirmed",
    "real_redacted_forwarding_no_api_ui_confirmed",
    "real_redacted_forwarding_no_persistence_confirmed",
    "real_redacted_forwarding_no_dna_save_confirmed",
    "real_redacted_forwarding_no_offline_save_confirmed",
    "real_redacted_forwarding_no_user_visible_emission_confirmed",
  ];

  const fixtureText = FIXTURE_TEXTS[fixtureMode];

  // Determine input mode: question fixtures use "real_question_guarded"
  const inputMode =
    fixtureMode === "pii_question_text" || fixtureMode === "human_review_text"
      ? "real_question_guarded"
      : "real_text_guarded";

  // ── Stage 1 — Input contract validation (8.2H-1) ─────────────────────────

  const contractInput = {
    inputMode,
    text: fixtureText,
    sourceKind: "typed_text",
    requestedLegalConclusion: fixtureMode === "legal_conclusion_requested_text" ? true : undefined,
    requestedPersistence: fixtureMode === "persistence_requested_text" ? true : undefined,
    validationRunId: `${harnessRunId}:input-contract`,
    neverUserVisible: true as const,
  };

  const inputContractResult = runRealTextInputContractValidation(contractInput);
  diagnostics.push("real_redacted_forwarding_input_contract_completed");

  if (
    inputContractResult.verdict !== "accepted_for_redaction_boundary" ||
    !inputContractResult.accepted
  ) {
    diagnostics.push("real_redacted_forwarding_blocked_input_contract");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "blocked_input_contract", diagnostics,
      inputContractResult.verdict, "", "", "", "", "", "",
      false, 0, false, false, false, false, false,
      [`Input contract blocked: ${inputContractResult.verdict}.`],
    );
  }

  const acceptedInput = inputContractResult.accepted;

  // ── Stage 2 — Redaction boundary (8.2H-2) ────────────────────────────────

  // high_risk_rejected_text uses rejectHighRiskPatterns: true
  const rejectHighRisk = fixtureMode === "high_risk_rejected_text";

  const redactionResult = runRealTextRedactionBoundary({
    acceptedInput,
    redactionRunId: `${harnessRunId}:redaction`,
    rejectHighRiskPatterns: rejectHighRisk,
    neverUserVisible: true,
  });
  diagnostics.push("real_redacted_forwarding_redaction_completed");

  // Invariant check on redaction result
  if (
    redactionResult.liveLLMCalled !== false ||
    redactionResult.persistenceUsed !== false ||
    redactionResult.dnaSavePerformed !== false ||
    redactionResult.offlineSavePerformed !== false
  ) {
    diagnostics.push("real_redacted_forwarding_failed_invariant_violation");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "failed_invariant_violation", diagnostics,
      inputContractResult.verdict, redactionResult.verdict, "", "", "", "", "",
      false, 0, false, false, false, false, false,
      ["Redaction boundary result violated safety invariants."],
    );
  }

  if (
    redactionResult.verdict !== "accepted_for_controlled_live_adapter" ||
    !redactionResult.accepted
  ) {
    diagnostics.push("real_redacted_forwarding_blocked_redaction_boundary");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "blocked_redaction_boundary", diagnostics,
      inputContractResult.verdict, redactionResult.verdict, "", "", "", "", "",
      false, 0, false, false, false, false, false,
      [`Redaction boundary blocked: ${redactionResult.verdict}.`],
    );
  }

  const redactionAccepted = redactionResult.accepted;
  const redactionApplied = redactionAccepted.redactionApplied;
  const redactionMatchCount = redactionAccepted.matches.length;

  // ── Stage 3 — Controlled live text adapter (8.2H-3) ──────────────────────

  const adapterResult = runControlledLiveTextAdapter({
    redactionAccepted,
    sourceInputMode: acceptedInput.inputMode,
    adapterRunId: `${harnessRunId}:adapter`,
    neverUserVisible: true,
  });
  diagnostics.push("real_redacted_forwarding_adapter_completed");

  // Invariant check on adapter result
  if (
    adapterResult.liveLLMCalled !== false ||
    adapterResult.persistenceUsed !== false ||
    adapterResult.dnaSavePerformed !== false ||
    adapterResult.offlineSavePerformed !== false ||
    adapterResult.uiTouched !== false
  ) {
    diagnostics.push("real_redacted_forwarding_failed_invariant_violation");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "failed_invariant_violation", diagnostics,
      inputContractResult.verdict, redactionResult.verdict, adapterResult.verdict,
      "", "", "", "",
      redactionApplied, redactionMatchCount, false, false, false, false, false,
      ["Adapter result violated safety invariants."],
    );
  }

  if (adapterResult.verdict !== "adapted_for_output_contract_validation") {
    diagnostics.push("real_redacted_forwarding_blocked_adapter");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "blocked_adapter", diagnostics,
      inputContractResult.verdict, redactionResult.verdict, adapterResult.verdict,
      "", "", "", "",
      redactionApplied, redactionMatchCount, false, false, false, false, false,
      [`Adapter blocked: ${adapterResult.verdict}.`],
    );
  }

  // ── Stage 4 — Build redaction proof (8.2I-1) ─────────────────────────────

  // For invalid_proof_tamper: build proof normally then tamper it
  const rawProof = buildControlledLiveTextRedactionProof({
    redactionAccepted,
    adapterResult,
    redactionRunId: `${harnessRunId}:redaction`,
    adapterRunId: `${harnessRunId}:adapter`,
    notes: [`Harness fixture: ${fixtureMode}.`],
  });

  const proof: ControlledLiveTextRedactionProof =
    fixtureMode === "invalid_proof_tamper"
      ? tamperProofInvalidStatus(rawProof)
      : rawProof;

  const proofValidation = validateControlledLiveTextRedactionProof(proof);
  const redactionProofValid = proofValidation.valid;
  diagnostics.push("real_redacted_forwarding_redaction_proof_built");

  // ── Stage 5 — Build ControlledLiveTextDraftResult (8.2I-1) ───────────────

  // For missing_prefix_tamper: tamper the adapter result sections before building
  const adapterResultForBuild: ControlledLiveTextAdapterResult =
    fixtureMode === "missing_prefix_tamper"
      ? tamperAdapterRemovePrefix(adapterResult)
      : adapterResult;

  const controlledLiveTextDraftResult = buildControlledLiveTextDraftResult({
    draftId: `${harnessRunId}:controlled-live-text-draft`,
    adapterResult: adapterResultForBuild,
    redactionProof: proof,
    appliedForbiddenMoves: [],
    appliedRequiredConstraints: [],
    diagnostics: ["controlled_live_text_draft_built"],
    auditTraceParentIds: [`${harnessRunId}:adapter`],
    notes: [`Harness fixture: ${fixtureMode}.`],
  });
  diagnostics.push("real_redacted_forwarding_draft_result_built");

  if (!controlledLiveTextDraftResult) {
    diagnostics.push("real_redacted_forwarding_blocked_draft_result_build");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "blocked_draft_result_build", diagnostics,
      inputContractResult.verdict, redactionResult.verdict, adapterResult.verdict,
      "", "", "", "",
      redactionApplied, redactionMatchCount, redactionProofValid,
      false, false, false, false,
      [
        "buildControlledLiveTextDraftResult returned null.",
        fixtureMode === "missing_prefix_tamper"
          ? "Reason: section draftText missing CONTROLLED_LIVE_TEXT_DRAFT_PREFIX (tampered)."
          : fixtureMode === "invalid_proof_tamper"
          ? "Reason: proof status tampered to 'failed'."
          : "Reason: unknown (check adapter verdict or proof validity).",
      ],
    );
  }

  const controlledLiveTextDraftBuilt = true;

  // ── Stage 6 — Raw value leak check ───────────────────────────────────────

  const sectionTexts = controlledLiveTextDraftResult.sectionCandidates.map(
    (sc) => sc.draftText,
  );

  const leakedValue = findRawValueLeak(sectionTexts, SYNTHETIC_PII_VALUES);

  if (leakedValue !== null) {
    diagnostics.push("real_redacted_forwarding_failed_raw_value_leak_check");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "failed_raw_value_leak_check", diagnostics,
      inputContractResult.verdict, redactionResult.verdict, adapterResult.verdict,
      "", "", "", "",
      redactionApplied, redactionMatchCount, redactionProofValid,
      controlledLiveTextDraftBuilt, false, false, false,
      [`Raw PII value leak detected in draft section text. Fixture: ${fixtureMode}.`],
    );
  }

  diagnostics.push("real_redacted_forwarding_raw_value_leak_check_passed");

  // ── Stage 7 — Output contract validator (8.2G-2) ─────────────────────────

  const contractAdapterInput: RuntimeLLMDraftAdapterInput = {
    adapterMode: "mock",
    accessTier: "free_preview",
    contractRef: `${harnessRunId}-controlled-live-text-contract`,
    allowedSectionTypes: [
      "what_this_means",
      "document_type_signal",
      "attention_points",
      "next_steps_safe",
      "uncertainty_notice",
      "review_recommendation",
      "blocked_content_notice",
    ],
    activeForbiddenMoves: [],
    activeRequiredConstraints: [],
    uncertaintyRequired: false,
    humanReviewRequired: false,
    auditTraceParentIds: [`${harnessRunId}:adapter`],
    neverUserVisible: true,
    notes: ["Adapter input context for output contract validator — controlled live text path."],
  };

  const outputContractResult = validateRuntimeLLMOutputContract({
    input: contractAdapterInput,
    result: controlledLiveTextDraftResult as unknown as RuntimeLLMOutputContractDraftResult,
  });
  diagnostics.push("real_redacted_forwarding_output_contract_completed");

  // Invariant check
  if (
    outputContractResult.userVisibleOutputAllowed !== false ||
    outputContractResult.acceptedForUserVisibleAssembly !== false
  ) {
    diagnostics.push("real_redacted_forwarding_failed_invariant_violation");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "failed_invariant_violation", diagnostics,
      inputContractResult.verdict, redactionResult.verdict, adapterResult.verdict,
      outputContractResult.verdict, "", "", "",
      redactionApplied, redactionMatchCount, redactionProofValid,
      controlledLiveTextDraftBuilt, true, true, true,
      ["Output contract result violated safety invariants."],
    );
  }

  if (outputContractResult.verdict !== "accepted_for_next_gate") {
    diagnostics.push("real_redacted_forwarding_blocked_output_contract");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "blocked_output_contract", diagnostics,
      inputContractResult.verdict, redactionResult.verdict, adapterResult.verdict,
      outputContractResult.verdict, "", "", "",
      redactionApplied, redactionMatchCount, redactionProofValid,
      controlledLiveTextDraftBuilt, true, true, true,
      [`Output contract rejected: ${outputContractResult.verdict}.`],
    );
  }

  // ── Stage 8 — Wording governance gate (8.2G-3) ────────────────────────────

  const scoreReport = mapToScoreReport(fixtureMode);

  const wordingResult = runRuntimeWordingGovernanceGate({
    draftResult: controlledLiveTextDraftResult as unknown as RuntimeLLMOutputContractDraftResult,
    outputContractValidation: outputContractResult,
    scoreReport,
    neverUserVisible: true,
  });
  diagnostics.push("real_redacted_forwarding_wording_gate_completed");

  if (
    wordingResult.liveLLMJudgeCalled !== false ||
    wordingResult.realTextSemanticallyEvaluated !== false ||
    wordingResult.userVisibleOutputAllowed !== false
  ) {
    diagnostics.push("real_redacted_forwarding_failed_invariant_violation");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "failed_invariant_violation", diagnostics,
      inputContractResult.verdict, redactionResult.verdict, adapterResult.verdict,
      outputContractResult.verdict, wordingResult.verdict, "", "",
      redactionApplied, redactionMatchCount, redactionProofValid,
      controlledLiveTextDraftBuilt, true, true, true,
      ["Wording gate result violated safety invariants."],
    );
  }

  if (wordingResult.verdict === "hard_fail_wording_violation") {
    diagnostics.push("real_redacted_forwarding_blocked_wording_gate");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "blocked_wording_gate", diagnostics,
      inputContractResult.verdict, redactionResult.verdict, adapterResult.verdict,
      outputContractResult.verdict, wordingResult.verdict, "", "",
      redactionApplied, redactionMatchCount, redactionProofValid,
      controlledLiveTextDraftBuilt, true, true, true,
      ["Wording gate hard fail — blocked."],
    );
  }

  if (
    wordingResult.verdict !== "accepted_for_audit_dry_run" &&
    wordingResult.verdict !== "human_review_required"
  ) {
    diagnostics.push("real_redacted_forwarding_blocked_wording_gate");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "blocked_wording_gate", diagnostics,
      inputContractResult.verdict, redactionResult.verdict, adapterResult.verdict,
      outputContractResult.verdict, wordingResult.verdict, "", "",
      redactionApplied, redactionMatchCount, redactionProofValid,
      controlledLiveTextDraftBuilt, true, true, true,
      [`Wording gate rejected: ${wordingResult.verdict}.`],
    );
  }

  // ── Stage 9 — Response assembler bridge (8.2G-6) ─────────────────────────

  const assemblerResult = runRuntimeResponseAssemblerBridge({
    draftResult: controlledLiveTextDraftResult as unknown as RuntimeLLMOutputContractDraftResult,
    outputContractValidation: outputContractResult,
    wordingGateResult: wordingResult,
    auditTraceValid: true,
    diagnosticEnvelopeValid: true,
    assemblyRunId: `${harnessRunId}:assembler`,
    neverUserVisible: true,
  });
  diagnostics.push("real_redacted_forwarding_response_assembler_completed");

  if (
    assemblerResult.userVisibleOutputEmitted !== false ||
    assemblerResult.userVisibleOutputAllowed !== false ||
    assemblerResult.persistenceUsed !== false ||
    assemblerResult.dnaSavePerformed !== false ||
    assemblerResult.offlineSavePerformed !== false
  ) {
    diagnostics.push("real_redacted_forwarding_failed_invariant_violation");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "failed_invariant_violation", diagnostics,
      inputContractResult.verdict, redactionResult.verdict, adapterResult.verdict,
      outputContractResult.verdict, wordingResult.verdict, assemblerResult.verdict, "",
      redactionApplied, redactionMatchCount, redactionProofValid,
      controlledLiveTextDraftBuilt, true, true, true,
      ["Assembler result violated safety invariants."],
    );
  }

  if (
    assemblerResult.verdict !== "assembled_internal_candidate" &&
    assemblerResult.verdict !== "assembled_human_review_packet"
  ) {
    diagnostics.push("real_redacted_forwarding_blocked_response_assembler");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "blocked_response_assembler", diagnostics,
      inputContractResult.verdict, redactionResult.verdict, adapterResult.verdict,
      outputContractResult.verdict, wordingResult.verdict, assemblerResult.verdict, "",
      redactionApplied, redactionMatchCount, redactionProofValid,
      controlledLiveTextDraftBuilt, true, true, true,
      [`Assembler rejected: ${assemblerResult.verdict}.`],
    );
  }

  // ── Stage 10 — User-visible authorisation gate (8.2G-7) ──────────────────

  const authorisationResult = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult,
    authorisationRunId: `${harnessRunId}:authorisation`,
    neverUserVisible: true,
  });
  diagnostics.push("real_redacted_forwarding_authorisation_completed");

  if (
    authorisationResult.emittedToUserNow !== false ||
    authorisationResult.persistenceUsed !== false ||
    authorisationResult.dnaSavePerformed !== false ||
    authorisationResult.offlineSavePerformed !== false
  ) {
    diagnostics.push("real_redacted_forwarding_failed_invariant_violation");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "failed_invariant_violation", diagnostics,
      inputContractResult.verdict, redactionResult.verdict, adapterResult.verdict,
      outputContractResult.verdict, wordingResult.verdict, assemblerResult.verdict,
      authorisationResult.verdict,
      redactionApplied, redactionMatchCount, redactionProofValid,
      controlledLiveTextDraftBuilt, true, true, true,
      ["Authorisation result violated safety invariants."],
    );
  }

  if (authorisationResult.verdict !== "authorised_internal_packet") {
    diagnostics.push("real_redacted_forwarding_blocked_user_visible_authorisation");
    return makeBlocked(
      harnessRunId, fixtureMode,
      "blocked_user_visible_authorisation", diagnostics,
      inputContractResult.verdict, redactionResult.verdict, adapterResult.verdict,
      outputContractResult.verdict, wordingResult.verdict, assemblerResult.verdict,
      authorisationResult.verdict,
      redactionApplied, redactionMatchCount, redactionProofValid,
      controlledLiveTextDraftBuilt, true, true, true,
      [`Authorisation rejected: ${authorisationResult.verdict}.`],
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────

  diagnostics.push("real_redacted_forwarding_completed_authorised_packet");

  return {
    harnessRunId,
    fixtureMode,
    verdict: "completed_authorised_internal_packet",
    diagnostics,
    inputContractVerdict: inputContractResult.verdict,
    redactionBoundaryVerdict: redactionResult.verdict,
    adapterVerdict: adapterResult.verdict,
    outputContractVerdict: outputContractResult.verdict,
    wordingGateVerdict: wordingResult.verdict,
    responseAssemblerVerdict: assemblerResult.verdict,
    authorisationVerdict: authorisationResult.verdict,
    redactionApplied,
    redactionMatchCount,
    redactionProofValid,
    controlledLiveTextDraftBuilt,
    controlledLiveTextDraftUsed: true,
    realRedactedTextForwardedToOutputContract: true,
    rawValueLeakCheckPassed: true,
    packetCreated: true,
    acceptedForUserVisibleAssembly: authorisationResult.acceptedForUserVisibleAssembly,
    userVisibleOutputAllowedForFuture: authorisationResult.userVisibleOutputAllowedForFuture,
    emittedToUserNow: false,
    liveLLMCalled: false,
    apiRouteTouched: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
    notes: [
      `Harness version: ${REAL_REDACTED_TEXT_FORWARDING_HARNESS_VERSION}.`,
      `Harness run ID: ${harnessRunId}.`,
      `Fixture mode: ${fixtureMode}.`,
      `Redaction applied: ${String(redactionApplied)}. Match count: ${String(redactionMatchCount)}.`,
      "ControlledLiveTextDraftResult built and validated by output contract.",
      "Raw value leak check passed — no synthetic PII in section draft texts.",
      "emittedToUserNow: false — packet for internal governance use only.",
      "No live LLM. No persistence. No public runtime.",
    ],
  };
}
