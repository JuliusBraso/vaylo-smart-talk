/**
 * Limited Pilot Gate regression scaffold (Phase 8.2F-11).
 *
 * Eight structural cases exercising runLimitedPilotGateScaffold:
 *
 *  Case 1 — invited + consent + clean OCR                 → allowed
 *  Case 2 — not invited                                   → blocked (pilot_unauthorized_subject)
 *  Case 3 — missing consent                               → blocked (pilot_missing_consent)
 *  Case 4 — session limit reached                         → blocked (pilot_session_limit_reached)
 *  Case 5 — OCR score 20                                  → blocked (pilot_blocked_by_ocr_degradation)
 *  Case 6 — missing dates OCR                             → human_review_required
 *  Case 7 — obscured sender OCR                           → blocked (pilot_blocked_by_ocr_degradation)
 *  Case 8 — containsRealUserDocument=true                 → out_of_scope + governanceCompromised
 *
 * No Jest/Vitest. No CI hook. No runtime integration.
 * No real user data. No LLM. No OCR SDK. No Smart Talk wiring.
 */

import type {
  LimitedPilotGateInput,
  LimitedPilotGateResult,
  PilotAccessDisposition,
  PilotGateDiagnosticCode,
} from "./limited-pilot-gate-types";
import type { OcrDegradationVector } from "./ocr-uncertainty-types";
import {
  LIMITED_PILOT_GATE_SCAFFOLD_VERSION,
  runLimitedPilotGateScaffold,
} from "./run-limited-pilot-gate-scaffold";

export const LIMITED_PILOT_GATE_REGRESSION_VERSION =
  "8.2f-11-limited-pilot-gate-regression-scaffold-v1";

// ── Result types ──────────────────────────────────────────────────────────────

export interface LimitedPilotGateRegressionCaseResult {
  readonly caseName: string;
  readonly passed: boolean;
  readonly gateResult: LimitedPilotGateResult;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface LimitedPilotGateRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly gateVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly LimitedPilotGateRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Shared fixture helpers ────────────────────────────────────────────────────

const CLEAN_OCR_VECTOR: OcrDegradationVector = {
  missingDates: false,
  obscuredSender: false,
  unreadableAmounts: false,
  lowResolution: false,
  truncatedText: false,
  mixedLanesDetected: false,
  possiblePromptInjectionText: false,
  partialDocumentOnly: false,
};

function withOcr(overrides: Partial<OcrDegradationVector>): OcrDegradationVector {
  return { ...CLEAN_OCR_VECTOR, ...overrides };
}

const BASE_SUBJECT: LimitedPilotGateInput["subject"] = {
  pilotSubjectRef: "regression-subject-placeholder",
  isInvited: true,
  consentSigned: true,
  pilotRole: "internal_tester",
  neverContainsRealUserData: true,
};

const BASE_TELEMETRY: LimitedPilotGateInput["telemetry"] = {
  totalTransactionsThisSession: 2,
  maxSessionLimit: 10,
  sequenceId: "regression-seq-001",
};

const BASE_SCOPE: LimitedPilotGateInput["scopeRequest"] = {
  documentFamily: "finanzamt_bescheid",
  sourceMode: "synthetic_only",
  accessTier: "free_preview",
  containsRealUserDocument: false,
};

function makeInput(
  overrides: Partial<{
    subject: Partial<LimitedPilotGateInput["subject"]>;
    telemetry: Partial<LimitedPilotGateInput["telemetry"]>;
    scopeRequest: Partial<LimitedPilotGateInput["scopeRequest"]>;
    ocrDegradation: OcrDegradationVector;
    baseOcrConfidenceScore: number;
  }>,
): LimitedPilotGateInput {
  return {
    subject: { ...BASE_SUBJECT, ...(overrides.subject ?? {}) },
    telemetry: { ...BASE_TELEMETRY, ...(overrides.telemetry ?? {}) },
    scopeRequest: { ...BASE_SCOPE, ...(overrides.scopeRequest ?? {}) },
    ocrDegradation: overrides.ocrDegradation ?? CLEAN_OCR_VECTOR,
    baseOcrConfidenceScore: overrides.baseOcrConfidenceScore ?? 90,
  };
}

// ── Assertion helper ──────────────────────────────────────────────────────────

function assertGate(
  caseName: string,
  result: LimitedPilotGateResult,
  opts: {
    expectTransactionAllowed: boolean;
    expectDisposition: PilotAccessDisposition;
    expectGovernanceCompromised: boolean;
    expectDiagnostics?: readonly PilotGateDiagnosticCode[];
    expectNoDiagnostics?: readonly PilotGateDiagnosticCode[];
  },
): LimitedPilotGateRegressionCaseResult {
  const failures: string[] = [];

  if (result.transactionAllowed !== opts.expectTransactionAllowed) {
    failures.push(
      `transactionAllowed: expected=${String(opts.expectTransactionAllowed)}, got=${String(result.transactionAllowed)}`,
    );
  }
  if (result.disposition !== opts.expectDisposition) {
    failures.push(
      `disposition: expected="${opts.expectDisposition}", got="${result.disposition}"`,
    );
  }
  if (result.governanceCompromised !== opts.expectGovernanceCompromised) {
    failures.push(
      `governanceCompromised: expected=${String(opts.expectGovernanceCompromised)}, got=${String(result.governanceCompromised)}`,
    );
  }
  for (const code of opts.expectDiagnostics ?? []) {
    if (!result.diagnostics.includes(code)) {
      failures.push(`Expected diagnostic "${code}" not in result.diagnostics`);
    }
  }
  for (const code of opts.expectNoDiagnostics ?? []) {
    if (result.diagnostics.includes(code)) {
      failures.push(`Diagnostic "${code}" must NOT be in result.diagnostics`);
    }
  }
  if (!result.neverUserVisible) {
    failures.push("neverUserVisible must be true on gate result");
  }
  // ocrEvaluation must always be present.
  if (!result.ocrEvaluation) {
    failures.push("ocrEvaluation must always be present in gate result");
  } else if (!result.ocrEvaluation.neverUserVisible) {
    failures.push("ocrEvaluation.neverUserVisible must be true");
  }

  const passed = failures.length === 0;
  return {
    caseName,
    passed,
    gateResult: result,
    failures,
    notes: [
      passed
        ? `Case "${caseName}" passed.`
        : `Case "${caseName}" failed with ${String(failures.length)} failure(s).`,
    ],
  };
}

// ── Case 1 — invited + consent + clean OCR → allowed ─────────────────────────

function runCase1(): LimitedPilotGateRegressionCaseResult {
  return assertGate(
    "invited_consent_clean_ocr_allowed",
    runLimitedPilotGateScaffold(makeInput({ baseOcrConfidenceScore: 90 })),
    {
      expectTransactionAllowed: true,
      expectDisposition: "allowed",
      expectGovernanceCompromised: false,
      expectDiagnostics: ["pilot_gate_passed"],
      expectNoDiagnostics: [
        "pilot_unauthorized_subject",
        "pilot_missing_consent",
        "pilot_session_limit_reached",
        "pilot_blocked_by_ocr_degradation",
      ],
    },
  );
}

// ── Case 2 — not invited → blocked ────────────────────────────────────────────

function runCase2(): LimitedPilotGateRegressionCaseResult {
  return assertGate(
    "not_invited_blocked",
    runLimitedPilotGateScaffold(
      makeInput({ subject: { isInvited: false } }),
    ),
    {
      expectTransactionAllowed: false,
      expectDisposition: "blocked",
      expectGovernanceCompromised: false,
      expectDiagnostics: ["pilot_unauthorized_subject"],
      expectNoDiagnostics: ["pilot_gate_passed", "pilot_missing_consent"],
    },
  );
}

// ── Case 3 — missing consent → blocked ───────────────────────────────────────

function runCase3(): LimitedPilotGateRegressionCaseResult {
  return assertGate(
    "missing_consent_blocked",
    runLimitedPilotGateScaffold(
      makeInput({ subject: { consentSigned: false } }),
    ),
    {
      expectTransactionAllowed: false,
      expectDisposition: "blocked",
      expectGovernanceCompromised: false,
      expectDiagnostics: ["pilot_missing_consent"],
      expectNoDiagnostics: ["pilot_gate_passed", "pilot_unauthorized_subject"],
    },
  );
}

// ── Case 4 — session limit reached → blocked ─────────────────────────────────

function runCase4(): LimitedPilotGateRegressionCaseResult {
  return assertGate(
    "session_limit_reached_blocked",
    runLimitedPilotGateScaffold(
      makeInput({
        telemetry: {
          totalTransactionsThisSession: 10,
          maxSessionLimit: 10,
        },
      }),
    ),
    {
      expectTransactionAllowed: false,
      expectDisposition: "blocked",
      expectGovernanceCompromised: false,
      expectDiagnostics: ["pilot_session_limit_reached"],
      expectNoDiagnostics: ["pilot_gate_passed"],
    },
  );
}

// ── Case 5 — OCR score 20 → blocked by OCR ───────────────────────────────────

function runCase5(): LimitedPilotGateRegressionCaseResult {
  return assertGate(
    "ocr_score_20_blocked",
    runLimitedPilotGateScaffold(makeInput({ baseOcrConfidenceScore: 20 })),
    {
      expectTransactionAllowed: false,
      expectDisposition: "blocked",
      expectGovernanceCompromised: false,
      expectDiagnostics: ["pilot_blocked_by_ocr_degradation"],
      expectNoDiagnostics: [
        "pilot_gate_passed",
        "pilot_human_review_required_by_ocr",
      ],
    },
  );
}

// ── Case 6 — missing dates → human_review_required ───────────────────────────

function runCase6(): LimitedPilotGateRegressionCaseResult {
  return assertGate(
    "missing_dates_ocr_human_review_required",
    runLimitedPilotGateScaffold(
      makeInput({
        ocrDegradation: withOcr({ missingDates: true }),
        baseOcrConfidenceScore: 72,
      }),
    ),
    {
      expectTransactionAllowed: true,
      expectDisposition: "human_review_required",
      expectGovernanceCompromised: false,
      expectDiagnostics: ["pilot_human_review_required_by_ocr"],
      expectNoDiagnostics: [
        "pilot_gate_passed",
        "pilot_blocked_by_ocr_degradation",
      ],
    },
  );
}

// ── Case 7 — obscured sender → blocked by OCR ────────────────────────────────

function runCase7(): LimitedPilotGateRegressionCaseResult {
  return assertGate(
    "obscured_sender_blocked_by_ocr",
    runLimitedPilotGateScaffold(
      makeInput({
        ocrDegradation: withOcr({ obscuredSender: true }),
        baseOcrConfidenceScore: 75,
      }),
    ),
    {
      expectTransactionAllowed: false,
      expectDisposition: "blocked",
      expectGovernanceCompromised: false,
      expectDiagnostics: ["pilot_blocked_by_ocr_degradation"],
      expectNoDiagnostics: [
        "pilot_gate_passed",
        "pilot_human_review_required_by_ocr",
      ],
    },
  );
}

// ── Case 8 — containsRealUserDocument=true → out_of_scope + governance ────────

function runCase8(): LimitedPilotGateRegressionCaseResult {
  return assertGate(
    "real_user_document_out_of_scope_governance_breach",
    runLimitedPilotGateScaffold(
      makeInput({
        scopeRequest: { containsRealUserDocument: true },
      }),
    ),
    {
      expectTransactionAllowed: false,
      expectDisposition: "out_of_scope",
      expectGovernanceCompromised: true,
      expectDiagnostics: ["pilot_scope_not_allowed"],
      expectNoDiagnostics: ["pilot_gate_passed"],
    },
  );
}

// ── Scaffold runner ───────────────────────────────────────────────────────────

/**
 * Runs all 8 limited pilot gate regression cases and aggregates results.
 *
 * Does not throw. All assertions collected as failure strings.
 * No real user data. No LLM. No OCR SDK. No Smart Talk runtime.
 */
export function runLimitedPilotGateRegressionScaffold(): LimitedPilotGateRegressionScaffoldResult {
  const caseResults: LimitedPilotGateRegressionCaseResult[] = [
    runCase1(),
    runCase2(),
    runCase3(),
    runCase4(),
    runCase5(),
    runCase6(),
    runCase7(),
    runCase8(),
  ];

  const allPassed = caseResults.every((r) => r.passed);
  const passCount = caseResults.filter((r) => r.passed).length;
  const failCount = caseResults.length - passCount;

  const notes: string[] = [
    `Limited pilot gate regression complete. ${String(passCount)}/${String(caseResults.length)} cases passed.`,
  ];

  if (allPassed) {
    notes.push(
      "All invite/consent/session/OCR/scope gate rules, governance breach detection, " +
        "and neverUserVisible invariants validated.",
    );
  } else {
    notes.push(
      `${String(failCount)} case(s) failed — review gateResult diagnostics for details.`,
    );
  }

  notes.push(
    "Scaffold is metadata-only: no pilot activated, no real user accessed, " +
      "no DB read, no OCR SDK, no LLM, no Smart Talk production wiring.",
  );

  return {
    scaffoldVersion: LIMITED_PILOT_GATE_REGRESSION_VERSION,
    gateVersion: LIMITED_PILOT_GATE_SCAFFOLD_VERSION,
    allPassed,
    caseResults,
    notes,
  };
}
