/**
 * Internal governance test harness types (Phase 8.2E-5).
 *
 * Type-only model for aggregating controlled-corpus scaffold results.
 * Not wired into runtime. No OCR, LLM, Smart Talk, deadline calculation,
 * explanation generation, or production cognition.
 */

export type InternalHarnessFailureCategory =
  | "registry_drift"
  | "boundary_gap"
  | "contract_gap"
  | "monetization_boundary_warning"
  | "privacy_warning"
  | "adversarial_alignment_gap"
  | "unknown_token"
  | "inconsistent_expectation";

export interface InternalHarnessScenarioResult {
  readonly scenarioId: string;
  readonly title: string;
  readonly structurallyValid: boolean;
  readonly boundaryConsistent: boolean;
  readonly contractConsistent: boolean;
  readonly passed: boolean;
  readonly warnings: readonly InternalHarnessFailureCategory[];
  readonly notes: readonly string[];
}

export interface InternalHarnessExecutionSummary {
  readonly harnessVersion: string;
  readonly scenarioCount: number;
  readonly passedCount: number;
  readonly failedCount: number;
  readonly warningCount: number;
  readonly structurallyValid: boolean;
  readonly fullyConsistent: boolean;
  readonly scenarioResults: readonly InternalHarnessScenarioResult[];
  readonly notes: readonly string[];
  /**
   * Architecture placeholder only. No RealitySimulationResult comparison is
   * implemented in Phase 8.2E-5.
   */
  readonly futureSimulationComparisonReady?: boolean;
  /**
   * Architecture placeholder only. No explanation/contract runtime output
   * comparison is implemented in Phase 8.2E-5.
   */
  readonly futureExplanationComparisonReady?: boolean;
}
