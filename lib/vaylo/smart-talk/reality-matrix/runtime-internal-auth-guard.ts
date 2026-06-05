/**
 * Runtime Internal Auth Guard (Phase 8.2G-10).
 *
 * Implements `runRuntimeInternalAuthGuard` — a pure server-side secret
 * comparison guard that hardens the guarded internal Smart Talk runtime branch.
 *
 * This guard sits BEFORE `runRuntimeGuardedDelivery()` in the API route.
 * It verifies that the caller supplies the correct server-side secret via the
 * `x-vaylo-internal-runtime-secret` request header, matching
 * `process.env.VAYLO_INTERNAL_RUNTIME_SECRET` (read by the caller and passed in).
 *
 * If the env secret is absent: guarded runtime is disabled entirely.
 * If the header is absent or wrong: the request is rejected with HTTP 403.
 *
 * This is NOT user authentication for normal Smart Talk requests.
 * Normal Smart Talk requests never include the guarded branch fields, so they
 * are never affected by this guard.
 *
 * Safety guarantees:
 * - No secrets are logged or returned in result values
 * - No external calls
 * - No persistence
 * - Pure synchronous function
 */

// ── Verdict ───────────────────────────────────────────────────────────────────

/**
 * The verdict of `runRuntimeInternalAuthGuard`.
 *
 * - `authorised`                    — expected secret present; provided secret matches exactly.
 * - `rejected_secret_env_missing`   — VAYLO_INTERNAL_RUNTIME_SECRET is undefined, empty, or whitespace.
 * - `rejected_secret_header_missing`— x-vaylo-internal-runtime-secret header is null, empty, or whitespace.
 * - `rejected_secret_mismatch`      — header present but does not match the expected secret.
 */
export type RuntimeInternalAuthGuardVerdict =
  | "authorised"
  | "rejected_secret_env_missing"
  | "rejected_secret_header_missing"
  | "rejected_secret_mismatch";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

export type RuntimeInternalAuthGuardDiagnosticCode =
  | "internal_auth_guard_started"
  | "internal_auth_secret_env_present"
  | "internal_auth_secret_header_present"
  | "internal_auth_authorised"
  | "internal_auth_rejected_secret_env_missing"
  | "internal_auth_rejected_secret_header_missing"
  | "internal_auth_rejected_secret_mismatch"
  | "internal_auth_no_persistence_confirmed";

// ── Input / Result ────────────────────────────────────────────────────────────

/**
 * Input to `runRuntimeInternalAuthGuard`.
 *
 * `providedSecret`  — value from the x-vaylo-internal-runtime-secret request header;
 *                     null when the header is absent.
 * `expectedSecret`  — value of process.env.VAYLO_INTERNAL_RUNTIME_SECRET;
 *                     undefined when the env var is not set.
 *
 * The caller is responsible for reading these values; the guard function
 * never touches env vars or request objects directly.
 */
export interface RuntimeInternalAuthGuardInput {
  readonly providedSecret: string | null;
  readonly expectedSecret: string | undefined;
}

/**
 * Result of `runRuntimeInternalAuthGuard`.
 *
 * `authorised` is `true` only when `verdict === "authorised"`.
 * `persistenceUsed` and `neverUserVisible` are always their literal values.
 * The result never contains the secret values.
 */
export interface RuntimeInternalAuthGuardResult {
  readonly verdict: RuntimeInternalAuthGuardVerdict;
  readonly authorised: boolean;
  readonly diagnostics: readonly RuntimeInternalAuthGuardDiagnosticCode[];
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;
}

// ── Guard function ────────────────────────────────────────────────────────────

/**
 * Validates that the caller holds the server-side internal runtime secret.
 *
 * Checks in order:
 *  1. Expected secret must be present and non-empty in the environment.
 *  2. Provided secret header must be present and non-empty.
 *  3. Provided secret must match expected secret exactly.
 *
 * Returns `authorised: true` only on an exact match.
 *
 * Pure function — no side effects, no logging, no secret values in output.
 */
export function runRuntimeInternalAuthGuard(
  input: RuntimeInternalAuthGuardInput,
): RuntimeInternalAuthGuardResult {
  const diagnostics: RuntimeInternalAuthGuardDiagnosticCode[] = [
    "internal_auth_guard_started",
    "internal_auth_no_persistence_confirmed",
  ];

  const expectedTrimmed = input.expectedSecret?.trim();
  if (!expectedTrimmed) {
    diagnostics.push("internal_auth_rejected_secret_env_missing");
    return {
      verdict: "rejected_secret_env_missing",
      authorised: false,
      diagnostics,
      persistenceUsed: false,
      neverUserVisible: true,
    };
  }
  diagnostics.push("internal_auth_secret_env_present");

  const providedTrimmed = input.providedSecret?.trim();
  if (!providedTrimmed) {
    diagnostics.push("internal_auth_rejected_secret_header_missing");
    return {
      verdict: "rejected_secret_header_missing",
      authorised: false,
      diagnostics,
      persistenceUsed: false,
      neverUserVisible: true,
    };
  }
  diagnostics.push("internal_auth_secret_header_present");

  if (providedTrimmed !== expectedTrimmed) {
    diagnostics.push("internal_auth_rejected_secret_mismatch");
    return {
      verdict: "rejected_secret_mismatch",
      authorised: false,
      diagnostics,
      persistenceUsed: false,
      neverUserVisible: true,
    };
  }

  diagnostics.push("internal_auth_authorised");
  return {
    verdict: "authorised",
    authorised: true,
    diagnostics,
    persistenceUsed: false,
    neverUserVisible: true,
  };
}
