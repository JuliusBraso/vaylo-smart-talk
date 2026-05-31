/**
 * Governance Kernel Closure Audit types (Phase 8.2F-16).
 *
 * Defines the structural vocabulary for the final closure audit of the
 * Vaylo Smart Talk Governance Kernel after phases 8.2A through 8.2F-15O.
 *
 * The closure audit formally determines whether the governance kernel is
 * complete enough to end Epoch 8.2F and start Epoch 8.2G — Runtime LLM
 * Integration — while acknowledging the production blockers that remain
 * outside the kernel.
 *
 * Safety guarantees:
 * - no runtime coupling
 * - no telemetry
 * - no persistence
 * - no logging
 * - no user-visible output
 * - all results carry neverUserVisible: true
 */

// ── Closure status ─────────────────────────────────────────────────────────────

/**
 * The top-level closure verdict for the governance kernel.
 *
 * - `complete_for_runtime_integration`    — the kernel is complete enough to
 *   start Epoch 8.2G (Runtime LLM Integration). All governance contract layers
 *   are scaffolded. Runtime debts are classified and accepted. Production
 *   blockers exist but are outside the kernel scope.
 *
 * - `complete_for_synthetic_governance_testing` — the kernel is complete for
 *   internal dry-run and scaffold regression testing but not yet ready to start
 *   the runtime integration epoch.
 *
 * - `blocked_for_runtime_integration`    — the kernel has unresolved blockers
 *   that must be fixed before the runtime integration epoch can begin.
 *
 * - `not_ready`                          — the kernel is incomplete; significant
 *   layers are missing or fundamentally broken.
 */
export type GovernanceKernelClosureStatus =
  | "complete_for_runtime_integration"
  | "complete_for_synthetic_governance_testing"
  | "blocked_for_runtime_integration"
  | "not_ready";

// ── Layer readiness ────────────────────────────────────────────────────────────

/**
 * Readiness classification for a single governance kernel layer.
 *
 * - `complete`                  — the layer's contract, validation, and regression
 *   scaffold are all present and structurally verified. No known blockers.
 *
 * - `partially_complete`        — the layer contract exists with known structural
 *   gaps that are classified as accepted runtime debts, not kernel blockers.
 *
 * - `deferred_to_runtime_epoch` — the layer's governance contract is defined but
 *   its runtime wiring is intentionally deferred to the next epoch.
 *
 * - `blocked`                   — the layer has an unresolved structural or
 *   governance blocker that must be resolved before the epoch can close.
 */
export type GovernanceKernelLayerReadiness =
  | "complete"
  | "partially_complete"
  | "deferred_to_runtime_epoch"
  | "blocked";

// ── Finding severity ───────────────────────────────────────────────────────────

/**
 * The severity of a governance kernel closure finding.
 *
 * - `informational` — documents a verified governance contract, resolved debt,
 *   or architectural decision. No action required for epoch transition.
 *
 * - `warning`       — identifies a known gap that is classified as an accepted
 *   runtime debt or deferred concern, not an epoch blocker.
 *
 * - `blocker`       — identifies something that blocks production readiness or
 *   safe public launch. These are NOT classified as kernel blockers for epoch
 *   transition; they are production blockers that live outside the kernel scope.
 */
export type GovernanceKernelClosureFindingSeverity =
  | "informational"
  | "warning"
  | "blocker";

// ── Layer identity ─────────────────────────────────────────────────────────────

/**
 * Identifiers for every discrete governance layer in the Vaylo Document
 * Reasoning Constitution V1 stack (phases 8.2A through 8.2F-15O).
 *
 * Ordered roughly from constitutional foundation to audit/attestation infrastructure.
 */
export type GovernanceKernelClosureLayerId =
  | "constitution"
  | "reality_matrix"
  | "evidence_gates"
  | "reality_simulation"
  | "explanation_contract"
  | "controlled_corpus"
  | "adversarial_corpus"
  | "free_preview_mapper"
  | "paid_mapper"
  | "smart_talk_bridge"
  | "wording_review"
  | "wording_evaluation"
  | "ocr_uncertainty"
  | "redacted_corpus"
  | "pilot_gate"
  | "incident_governance"
  | "provenance_audit"
  | "diagnostic_namespace"
  | "attestation_contracts"
  | "governance_lineage_audit";

// ── Finding disposition ────────────────────────────────────────────────────────

/**
 * The closure disposition for a governance kernel finding.
 *
 * - `closed`                         — the issue is fully resolved within the
 *   kernel. No further action required before epoch transition.
 *
 * - `accepted_runtime_debt`          — the gap is real but intentionally deferred
 *   to the runtime integration epoch. The kernel contract is considered complete
 *   at the scaffold/metadata level.
 *
 * - `deferred_to_runtime_integration`— the behavior requires real runtime
 *   components (LLM, OCR, auth, DB) that belong to the next epoch.
 *
 * - `requires_followup_before_pilot` — the issue must be addressed before any
 *   real pilot with real users can begin, but does not block epoch transition.
 */
export type GovernanceKernelClosureFindingDisposition =
  | "closed"
  | "accepted_runtime_debt"
  | "deferred_to_runtime_integration"
  | "requires_followup_before_pilot";

// ── Layer readiness entry ──────────────────────────────────────────────────────

/**
 * The readiness record for a single governance kernel layer.
 *
 * `layerId`   — identifies the layer in the governance stack.
 * `readiness` — the overall readiness classification.
 * `notes`     — never-user-visible notes explaining the readiness classification.
 */
export interface GovernanceKernelLayerReadinessEntry {
  readonly layerId: GovernanceKernelClosureLayerId;
  readonly readiness: GovernanceKernelLayerReadiness;
  readonly notes: readonly string[];
}

// ── Finding ───────────────────────────────────────────────────────────────────

/**
 * A single never-user-visible governance kernel closure finding.
 *
 * `layerId`      — the primary governance layer this finding concerns.
 * `severity`     — operational significance within the closure audit.
 * `title`        — short never-user-visible label.
 * `description`  — internal governance detail; never user-visible.
 * `disposition`  — how this finding is handled at epoch closure.
 * `neverUserVisible` — compile-time invariant.
 */
export interface GovernanceKernelClosureFinding {
  readonly layerId: GovernanceKernelClosureLayerId;
  readonly severity: GovernanceKernelClosureFindingSeverity;
  readonly title: string;
  readonly description: string;
  readonly disposition: GovernanceKernelClosureFindingDisposition;
  readonly neverUserVisible: true;
}

// ── Audit result ──────────────────────────────────────────────────────────────

/**
 * The never-user-visible result of `runGovernanceKernelClosureAuditScaffold`.
 *
 * `closureStatus`          — the top-level closure verdict.
 * `layerReadiness`         — per-layer readiness classifications.
 * `findings`               — ordered list of never-user-visible closure findings.
 * `blockerCount`           — count of findings with severity "blocker".
 * `warningCount`           — count of findings with severity "warning".
 * `acceptedRuntimeDebtCount`— count of findings with disposition "accepted_runtime_debt"
 *                            or "deferred_to_runtime_integration".
 * `nextEpoch`              — the formally designated next epoch after kernel closure.
 * `neverUserVisible`       — compile-time invariant.
 */
export interface GovernanceKernelClosureAuditResult {
  readonly closureStatus: GovernanceKernelClosureStatus;
  readonly layerReadiness: readonly GovernanceKernelLayerReadinessEntry[];
  readonly findings: readonly GovernanceKernelClosureFinding[];
  readonly blockerCount: number;
  readonly warningCount: number;
  readonly acceptedRuntimeDebtCount: number;
  readonly nextEpoch: "runtime_llm_integration";
  readonly neverUserVisible: true;
}
