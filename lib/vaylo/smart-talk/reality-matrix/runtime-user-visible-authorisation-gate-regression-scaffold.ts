/**
 * Runtime User-Visible Response Authorisation Gate regression scaffold (Phase 8.2G-7).
 *
 * Validates `runRuntimeUserVisibleAuthorisationGate` across 12 cases covering all
 * rejection paths, the success path, packet invariants, and field safety checks.
 *
 * Cases:
 *  1.  Safe assembled_internal_candidate → authorised_internal_packet
 *  2.  assembled_human_review_packet → rejected_human_review_packet
 *  3.  Unsupported assembler verdict → rejected_unsupported_verdict
 *  4.  eligibleForFutureUserVisibleAssembly:false → rejected_assembler_not_eligible
 *  5.  userVisibleOutputEmitted:true (tampered) → rejected_user_visible_emission_detected
 *  6.  persistenceUsed:true (tampered) → rejected_persistence_detected
 *  7.  dnaSavePerformed:true (tampered) → rejected_save_detected
 *  8.  offlineSavePerformed:true (tampered) → rejected_save_detected
 *  9.  sectionCandidates empty → rejected_missing_sections
 * 10.  containsInternalMetadata:true on a section → rejected_internal_metadata_leak
 * 11.  Packet sections contain only allowed fields
 * 12.  Invariants: emittedToUserNow/persistenceUsed/dnaSave/offlineSave always false
 *
 * No Jest/Vitest. No CI hook. No live LLM call. No API key required.
 */

import {
  runRuntimeUserVisibleAuthorisationGate,
  RUNTIME_USER_VISIBLE_AUTHORISATION_GATE_VERSION,
} from "./run-runtime-user-visible-authorisation-gate";
import type {
  RuntimeUserVisibleAuthorisationResult,
  RuntimeUserVisibleAuthorisationVerdict,
  RuntimeUserVisibleAuthorisationDiagnosticCode,
} from "./runtime-user-visible-authorisation-gate-types";
import type { RuntimeResponseAssemblerBridgeResult } from "./runtime-response-assembler-bridge-types";
import type { RuntimeResponseAssemblerSectionCandidate } from "./runtime-response-assembler-bridge-types";

export const USER_VISIBLE_AUTH_SCAFFOLD_VERSION =
  "8.2g-7-runtime-user-visible-authorisation-gate-regression-v1";

// ── Result types ──────────────────────────────────────────────────────────────

export interface AuthGateCaseResult {
  readonly caseNumber: number;
  readonly caseName: string;
  readonly passed: boolean;
  readonly failures: readonly string[];
  readonly gateResult?: RuntimeUserVisibleAuthorisationResult;
  readonly notes?: readonly string[];
}

export interface AuthGateScaffoldResult {
  readonly scaffoldVersion: string;
  readonly allPassed: boolean;
  readonly passCount: number;
  readonly failCount: number;
  readonly caseResults: readonly AuthGateCaseResult[];
  readonly notes: readonly string[];
}

// ── Assertion helpers ─────────────────────────────────────────────────────────

function fail(message: string, failures: string[]): void {
  failures.push(message);
}

function assertEq<T>(actual: T, expected: T, label: string, failures: string[]): void {
  if (actual !== expected) {
    fail(`${label}: expected ${String(expected)}, got ${String(actual)}`, failures);
  }
}

function assertVerdict(
  r: RuntimeUserVisibleAuthorisationResult,
  expected: RuntimeUserVisibleAuthorisationVerdict,
  failures: string[],
): void {
  assertEq(r.verdict, expected, "verdict", failures);
}

function assertDiagPresent(
  r: RuntimeUserVisibleAuthorisationResult,
  code: RuntimeUserVisibleAuthorisationDiagnosticCode,
  failures: string[],
): void {
  if (!r.diagnostics.includes(code)) {
    fail(`Expected diagnostic '${code}' but was absent.`, failures);
  }
}

function assertInvariants(r: RuntimeUserVisibleAuthorisationResult, failures: string[]): void {
  assertEq(r.emittedToUserNow, false, "emittedToUserNow", failures);
  assertEq(r.persistenceUsed, false, "persistenceUsed", failures);
  assertEq(r.dnaSavePerformed, false, "dnaSavePerformed", failures);
  assertEq(r.offlineSavePerformed, false, "offlineSavePerformed", failures);
  assertEq(r.neverUserVisible, true, "neverUserVisible", failures);
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const SAFE_SECTION: RuntimeResponseAssemblerSectionCandidate = {
  sectionKind: "document_type_signal",
  textCandidate: "Invoice — synthetic internal candidate.",
  sourceSectionType: "document_type_signal",
  derivedFromDraftId: "8.2g-7-scaffold-draft-001",
  internalDraftPrefixRemoved: true,
  containsInternalMetadata: false,
  neverUserVisible: true,
  notes: ["Safe fixture section."],
};

const UNCERTAINTY_SECTION: RuntimeResponseAssemblerSectionCandidate = {
  sectionKind: "uncertainty_notice",
  textCandidate: "Uncertainty notice — synthetic.",
  sourceSectionType: "uncertainty_notice",
  derivedFromDraftId: "8.2g-7-scaffold-draft-001",
  internalDraftPrefixRemoved: true,
  containsInternalMetadata: false,
  neverUserVisible: true,
};

function makeSafeAssemblerResult(
  overrides: Partial<RuntimeResponseAssemblerBridgeResult> = {},
): RuntimeResponseAssemblerBridgeResult {
  return {
    assemblyRunId: "8.2g-7-scaffold-assembly-001",
    verdict: "assembled_internal_candidate",
    eligibleForFutureUserVisibleAssembly: true,
    userVisibleOutputEmitted: false,
    userVisibleOutputAllowed: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    sectionCandidates: [SAFE_SECTION, UNCERTAINTY_SECTION],
    diagnostics: [
      "response_assembler_started",
      "response_assembler_internal_candidate_created",
      "response_assembler_no_persistence_confirmed",
    ],
    upstreamDraftId: "8.2g-7-scaffold-draft-001",
    liveLLMCalled: false,
    neverUserVisible: true,
    notes: ["Safe scaffold assembler result."],
    ...overrides,
  };
}

// ── Cases ─────────────────────────────────────────────────────────────────────

// Case 1: safe assembled_internal_candidate → authorised_internal_packet
function case1_safePathAuthorised(): AuthGateCaseResult {
  const failures: string[] = [];
  const r = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult: makeSafeAssemblerResult(),
    authorisationRunId: "8.2g-7-case1-auth",
    neverUserVisible: true,
  });

  assertVerdict(r, "authorised_internal_packet", failures);
  assertEq(r.acceptedForUserVisibleAssembly, true, "acceptedForUserVisibleAssembly", failures);
  assertEq(r.userVisibleOutputAllowedForFuture, true, "userVisibleOutputAllowedForFuture", failures);
  assertEq(r.emittedToUserNow, false, "emittedToUserNow", failures);
  assertDiagPresent(r, "user_visible_auth_packet_created", failures);
  assertDiagPresent(r, "user_visible_auth_assembler_candidate_confirmed", failures);
  if (r.packet === null) {
    fail("packet must not be null for authorised_internal_packet", failures);
  } else {
    assertEq(r.packet.authorisedForFutureDelivery, true, "packet.authorisedForFutureDelivery", failures);
    assertEq(r.packet.emittedToUserNow, false, "packet.emittedToUserNow", failures);
    assertEq(r.packet.persistenceUsed, false, "packet.persistenceUsed", failures);
    assertEq(r.packet.dnaSavePerformed, false, "packet.dnaSavePerformed", failures);
    assertEq(r.packet.offlineSavePerformed, false, "packet.offlineSavePerformed", failures);
    assertEq(r.packet.sections.length, 2, "packet.sections.length", failures);
  }
  assertInvariants(r, failures);

  return {
    caseNumber: 1,
    caseName: "safe assembled_internal_candidate → authorised_internal_packet",
    passed: failures.length === 0,
    failures,
    gateResult: r,
    notes: [
      "First authorised UserVisibleResponsePacket in the pipeline.",
      "authorisedForFutureDelivery: true; emittedToUserNow: false.",
    ],
  };
}

// Case 2: assembled_human_review_packet → rejected_human_review_packet
function case2_humanReviewRejected(): AuthGateCaseResult {
  const failures: string[] = [];
  const r = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult: makeSafeAssemblerResult({
      verdict: "assembled_human_review_packet",
      eligibleForFutureUserVisibleAssembly: false,
    }),
    authorisationRunId: "8.2g-7-case2-auth",
    neverUserVisible: true,
  });

  assertVerdict(r, "rejected_human_review_packet", failures);
  assertEq(r.acceptedForUserVisibleAssembly, false, "acceptedForUserVisibleAssembly", failures);
  assertEq(r.packet, null, "packet must be null", failures);
  assertDiagPresent(r, "user_visible_auth_rejected_human_review_packet", failures);
  assertInvariants(r, failures);

  return {
    caseNumber: 2,
    caseName: "assembled_human_review_packet → rejected_human_review_packet",
    passed: failures.length === 0,
    failures,
    gateResult: r,
    notes: ["Human review must be completed before authorisation."],
  };
}

// Case 3: unsupported assembler verdict → rejected_unsupported_verdict
function case3_unsupportedVerdict(): AuthGateCaseResult {
  const failures: string[] = [];
  const r = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult: makeSafeAssemblerResult({
      verdict: "rejected_wording_gate_not_accepted",
      eligibleForFutureUserVisibleAssembly: false,
    }),
    authorisationRunId: "8.2g-7-case3-auth",
    neverUserVisible: true,
  });

  assertVerdict(r, "rejected_unsupported_verdict", failures);
  assertEq(r.acceptedForUserVisibleAssembly, false, "acceptedForUserVisibleAssembly", failures);
  assertEq(r.packet, null, "packet must be null", failures);
  assertInvariants(r, failures);

  return {
    caseNumber: 3,
    caseName: "rejected assembler verdict → rejected_unsupported_verdict",
    passed: failures.length === 0,
    failures,
    gateResult: r,
  };
}

// Case 4: eligibleForFutureUserVisibleAssembly:false → rejected_assembler_not_eligible
function case4_notEligible(): AuthGateCaseResult {
  const failures: string[] = [];
  const r = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult: makeSafeAssemblerResult({
      eligibleForFutureUserVisibleAssembly: false,
    }),
    authorisationRunId: "8.2g-7-case4-auth",
    neverUserVisible: true,
  });

  assertVerdict(r, "rejected_assembler_not_eligible", failures);
  assertDiagPresent(r, "user_visible_auth_rejected_assembler_not_eligible", failures);
  assertEq(r.packet, null, "packet must be null", failures);
  assertInvariants(r, failures);

  return {
    caseNumber: 4,
    caseName: "eligibleForFutureUserVisibleAssembly:false → rejected_assembler_not_eligible",
    passed: failures.length === 0,
    failures,
    gateResult: r,
  };
}

// Case 5: userVisibleOutputEmitted:true (tampered) → rejected_user_visible_emission_detected
function case5_emissionDetected(): AuthGateCaseResult {
  const failures: string[] = [];
  const tamperedResult = {
    ...makeSafeAssemblerResult(),
    userVisibleOutputEmitted: true as unknown as false,
  };
  const r = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult: tamperedResult,
    authorisationRunId: "8.2g-7-case5-auth",
    neverUserVisible: true,
  });

  assertVerdict(r, "rejected_user_visible_emission_detected", failures);
  assertDiagPresent(r, "user_visible_auth_rejected_user_visible_emission_detected", failures);
  assertEq(r.packet, null, "packet must be null", failures);
  assertInvariants(r, failures);

  return {
    caseNumber: 5,
    caseName: "tampered userVisibleOutputEmitted:true → rejected_user_visible_emission_detected",
    passed: failures.length === 0,
    failures,
    gateResult: r,
    notes: ["Upstream emission invariant violation detected and blocked."],
  };
}

// Case 6: persistenceUsed:true (tampered) → rejected_persistence_detected
function case6_persistenceDetected(): AuthGateCaseResult {
  const failures: string[] = [];
  const tamperedResult = {
    ...makeSafeAssemblerResult(),
    persistenceUsed: true as unknown as false,
  };
  const r = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult: tamperedResult,
    authorisationRunId: "8.2g-7-case6-auth",
    neverUserVisible: true,
  });

  assertVerdict(r, "rejected_persistence_detected", failures);
  assertDiagPresent(r, "user_visible_auth_rejected_persistence_detected", failures);
  assertEq(r.packet, null, "packet must be null", failures);
  assertInvariants(r, failures);

  return {
    caseNumber: 6,
    caseName: "tampered persistenceUsed:true → rejected_persistence_detected",
    passed: failures.length === 0,
    failures,
    gateResult: r,
  };
}

// Case 7: dnaSavePerformed:true (tampered) → rejected_save_detected
function case7_dnaSaveDetected(): AuthGateCaseResult {
  const failures: string[] = [];
  const tamperedResult = {
    ...makeSafeAssemblerResult(),
    dnaSavePerformed: true as unknown as false,
  };
  const r = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult: tamperedResult,
    authorisationRunId: "8.2g-7-case7-auth",
    neverUserVisible: true,
  });

  assertVerdict(r, "rejected_save_detected", failures);
  assertDiagPresent(r, "user_visible_auth_rejected_save_detected", failures);
  assertEq(r.packet, null, "packet must be null", failures);
  assertInvariants(r, failures);

  return {
    caseNumber: 7,
    caseName: "tampered dnaSavePerformed:true → rejected_save_detected",
    passed: failures.length === 0,
    failures,
    gateResult: r,
  };
}

// Case 8: offlineSavePerformed:true (tampered) → rejected_save_detected
function case8_offlineSaveDetected(): AuthGateCaseResult {
  const failures: string[] = [];
  const tamperedResult = {
    ...makeSafeAssemblerResult(),
    offlineSavePerformed: true as unknown as false,
  };
  const r = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult: tamperedResult,
    authorisationRunId: "8.2g-7-case8-auth",
    neverUserVisible: true,
  });

  assertVerdict(r, "rejected_save_detected", failures);
  assertDiagPresent(r, "user_visible_auth_rejected_save_detected", failures);
  assertEq(r.packet, null, "packet must be null", failures);
  assertInvariants(r, failures);

  return {
    caseNumber: 8,
    caseName: "tampered offlineSavePerformed:true → rejected_save_detected",
    passed: failures.length === 0,
    failures,
    gateResult: r,
  };
}

// Case 9: sectionCandidates empty → rejected_missing_sections
function case9_missingSections(): AuthGateCaseResult {
  const failures: string[] = [];
  const r = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult: makeSafeAssemblerResult({ sectionCandidates: [] }),
    authorisationRunId: "8.2g-7-case9-auth",
    neverUserVisible: true,
  });

  assertVerdict(r, "rejected_missing_sections", failures);
  assertDiagPresent(r, "user_visible_auth_rejected_missing_sections", failures);
  assertEq(r.packet, null, "packet must be null", failures);
  assertInvariants(r, failures);

  return {
    caseNumber: 9,
    caseName: "empty sectionCandidates → rejected_missing_sections",
    passed: failures.length === 0,
    failures,
    gateResult: r,
  };
}

// Case 10: containsInternalMetadata:true → rejected_internal_metadata_leak
function case10_metadataLeak(): AuthGateCaseResult {
  const failures: string[] = [];
  const leakySection: RuntimeResponseAssemblerSectionCandidate = {
    ...SAFE_SECTION,
    containsInternalMetadata: true,
    textCandidate: "Contains llm_output_ internal marker.",
  };
  const r = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult: makeSafeAssemblerResult({ sectionCandidates: [leakySection] }),
    authorisationRunId: "8.2g-7-case10-auth",
    neverUserVisible: true,
  });

  assertVerdict(r, "rejected_internal_metadata_leak", failures);
  assertDiagPresent(r, "user_visible_auth_rejected_internal_metadata_leak", failures);
  assertEq(r.packet, null, "packet must be null", failures);
  assertInvariants(r, failures);

  return {
    caseNumber: 10,
    caseName: "section with containsInternalMetadata:true → rejected_internal_metadata_leak",
    passed: failures.length === 0,
    failures,
    gateResult: r,
  };
}

// Case 11: packet sections contain only allowed fields
function case11_packetSectionsClean(): AuthGateCaseResult {
  const failures: string[] = [];
  const r = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult: makeSafeAssemblerResult(),
    authorisationRunId: "8.2g-7-case11-auth",
    neverUserVisible: true,
  });

  if (r.verdict !== "authorised_internal_packet" || r.packet === null) {
    return {
      caseNumber: 11,
      caseName: "packet sections contain only allowed fields",
      passed: false,
      failures: [`Prerequisite failed: ${r.verdict}`],
    };
  }

  const allowedKeys = ["sectionKind", "text", "sourceIndex", "neverContainsInternalMetadata"];
  for (const section of r.packet.sections) {
    const sectionRaw = section as unknown as Record<string, unknown>;
    const keys = Object.keys(sectionRaw);
    const disallowed = keys.filter((k) => !allowedKeys.includes(k));
    if (disallowed.length > 0) {
      fail(`Packet section has unexpected keys: ${disallowed.join(", ")}`, failures);
    }
    if (typeof sectionRaw["diagnostics"] !== "undefined") {
      fail("Packet section must not contain 'diagnostics'", failures);
    }
    if (typeof sectionRaw["safetyFlags"] !== "undefined") {
      fail("Packet section must not contain 'safetyFlags'", failures);
    }
    if (typeof sectionRaw["sandboxGuardProof"] !== "undefined") {
      fail("Packet section must not contain 'sandboxGuardProof'", failures);
    }
    if (typeof sectionRaw["neverUserVisible"] !== "undefined") {
      fail("Packet section must not contain 'neverUserVisible' (internal invariant field)", failures);
    }
  }
  assertInvariants(r, failures);

  return {
    caseNumber: 11,
    caseName: "packet sections contain only: sectionKind, text, sourceIndex, neverContainsInternalMetadata",
    passed: failures.length === 0,
    failures,
    gateResult: r,
    notes: ["No internal governance fields leak into the packet section shape."],
  };
}

// Case 12: invariants always false/true on all paths
function case12_invariants(): AuthGateCaseResult {
  const failures: string[] = [];

  // Success path
  const rSuccess = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult: makeSafeAssemblerResult(),
    authorisationRunId: "8.2g-7-case12-success",
    neverUserVisible: true,
  });
  assertInvariants(rSuccess, failures);
  assertDiagPresent(rSuccess, "user_visible_auth_future_delivery_only", failures);
  assertDiagPresent(rSuccess, "user_visible_auth_no_api_route_confirmed", failures);
  assertDiagPresent(rSuccess, "user_visible_auth_no_ui_emission_confirmed", failures);
  assertDiagPresent(rSuccess, "user_visible_auth_no_persistence_confirmed", failures);

  // Rejected path
  const rRejected = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult: makeSafeAssemblerResult({ verdict: "rejected_missing_sections", eligibleForFutureUserVisibleAssembly: false }),
    authorisationRunId: "8.2g-7-case12-rejected",
    neverUserVisible: true,
  });
  assertInvariants(rRejected, failures);

  return {
    caseNumber: 12,
    caseName: "invariants always correct on success and rejected paths",
    passed: failures.length === 0,
    failures,
    notes: [
      "emittedToUserNow:false, persistenceUsed:false, dnaSavePerformed:false, offlineSavePerformed:false, neverUserVisible:true on all paths.",
      "Invariant diagnostics always emitted.",
    ],
  };
}

// ── Scaffold ──────────────────────────────────────────────────────────────────

/**
 * Runs all 12 regression cases for Phase 8.2G-7.
 *
 * No persistence. No logging. No live LLM call. No API key.
 */
export function runUserVisibleAuthorisationGateRegressionScaffold(): AuthGateScaffoldResult {
  const caseResults: AuthGateCaseResult[] = [
    case1_safePathAuthorised(),
    case2_humanReviewRejected(),
    case3_unsupportedVerdict(),
    case4_notEligible(),
    case5_emissionDetected(),
    case6_persistenceDetected(),
    case7_dnaSaveDetected(),
    case8_offlineSaveDetected(),
    case9_missingSections(),
    case10_metadataLeak(),
    case11_packetSectionsClean(),
    case12_invariants(),
  ];

  const passCount = caseResults.filter((c) => c.passed).length;
  const failCount = caseResults.length - passCount;
  const allPassed = failCount === 0;

  return {
    scaffoldVersion: USER_VISIBLE_AUTH_SCAFFOLD_VERSION,
    allPassed,
    passCount,
    failCount,
    caseResults,
    notes: [
      `Phase 8.2G-7 — User-Visible Response Authorisation Gate regression scaffold.`,
      `Gate version: ${RUNTIME_USER_VISIBLE_AUTHORISATION_GATE_VERSION}.`,
      "12 cases: authorisation path, all rejection paths, packet field safety, invariants.",
      "No Jest, no Vitest, no CI hook. No live LLM call. No API key required.",
      "No Smart Talk wiring. No user-visible output. No persistence.",
      `All cases passed: ${String(allPassed)} (${String(passCount)}/${String(caseResults.length)}).`,
    ],
  };
}
