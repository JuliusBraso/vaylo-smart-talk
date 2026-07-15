/**
 * PHASE 8.11R — Smart Talk Rate Limiter (extracted from app/api/smart-talk/route.ts)
 *
 * Pure extraction of the pre-existing module-level in-memory sliding-window
 * rate limiter that previously lived directly inside
 * `app/api/smart-talk/route.ts` (module-level `ipHits` Map, `RATE_WINDOW_MS`,
 * `RATE_MAX`, `getClientIp`, `takeRateSlot`). Production behavior is
 * unchanged: same window duration, same request limit, same fail-closed
 * sliding-window semantics, same client-IP resolution order
 * (`x-forwarded-for` first segment, then `x-real-ip`, then `"unknown"`).
 *
 * This module intentionally adds no new environment flag, no secret test
 * header, no request-body/query bypass, and no NODE_ENV-based automatic
 * bypass — none of those existed before this extraction and none are
 * introduced now.
 *
 * TEST-ISOLATION PREPARATION (for PHASE 8.11S):
 * `createInMemorySmartTalkRateLimiter` is a factory that always returns a
 * brand-new limiter with its own private `Map` and an injectable clock —
 * it shares no state with `getRuntimeSmartTalkRateLimiter()`'s production
 * singleton. This makes deterministic, isolated unit tests possible without
 * touching the production limiter. Route-level integration tests that go
 * through the real HTTP handler still exercise the shared production
 * singleton, so PHASE 8.11S may still need distinct TEST-NET IP addresses
 * per scenario to avoid cross-test interference at that layer — this
 * extraction does not change that (see `routeLevelDeterministicIsolationFullySolved`
 * in the 8.11R audit, which truthfully reports this as still `false`).
 *
 * No HTTP-reachable reset function is exposed. Isolated factory instances
 * (rather than a mutable reset on the shared singleton) are the intended
 * mechanism for deterministic tests.
 */

export interface SmartTalkRateLimitDecision {
  allowed: boolean;
}

export interface SmartTalkRateLimiterClock {
  now(): number;
}

export interface SmartTalkRateLimiter {
  check(ip: string): SmartTalkRateLimitDecision;
}

export interface SmartTalkRateLimiterOptions {
  windowMs?: number;
  maxRequests?: number;
  clock?: SmartTalkRateLimiterClock;
}

/** Same values previously hardcoded directly in app/api/smart-talk/route.ts. */
export const SMART_TALK_RATE_WINDOW_MS = 10 * 60 * 1000;
export const SMART_TALK_RATE_MAX_REQUESTS = 5;

const systemClock: SmartTalkRateLimiterClock = { now: () => Date.now() };

/**
 * Creates a fully isolated in-memory sliding-window rate limiter instance
 * with its own private store and its own (optionally injected,
 * deterministic) clock. Never shares state with any other instance,
 * including the production runtime singleton below.
 */
export function createInMemorySmartTalkRateLimiter(
  options: SmartTalkRateLimiterOptions = {},
): SmartTalkRateLimiter {
  const windowMs = options.windowMs ?? SMART_TALK_RATE_WINDOW_MS;
  const maxRequests = options.maxRequests ?? SMART_TALK_RATE_MAX_REQUESTS;
  const clock = options.clock ?? systemClock;
  const hits = new Map<string, number[]>();

  return {
    check(ip: string): SmartTalkRateLimitDecision {
      const now = clock.now();
      const cutoff = now - windowMs;
      let ipHits = hits.get(ip) ?? [];
      ipHits = ipHits.filter((t) => t > cutoff);
      if (ipHits.length >= maxRequests) {
        hits.set(ip, ipHits);
        return { allowed: false };
      }
      ipHits.push(now);
      hits.set(ip, ipHits);
      return { allowed: true };
    },
  };
}

let runtimeSingleton: SmartTalkRateLimiter | null = null;

/**
 * Returns the single production runtime limiter instance, lazily created
 * on first use with the same window/limit constants the route previously
 * hardcoded. Always the same instance for the lifetime of the process —
 * this preserves the exact same production semantics as the previous
 * module-level `ipHits` Map.
 */
export function getRuntimeSmartTalkRateLimiter(): SmartTalkRateLimiter {
  if (!runtimeSingleton) {
    runtimeSingleton = createInMemorySmartTalkRateLimiter();
  }
  return runtimeSingleton;
}

/**
 * Resolves the client IP used as the rate-limit key, in the exact same
 * order the route previously used directly: first segment of
 * `x-forwarded-for`, then `x-real-ip`, then the literal string `"unknown"`.
 * No request-controlled value can disable or bypass the limiter itself —
 * an unresolvable IP still shares (and is still bounded by) the
 * `"unknown"` bucket, it does not skip rate limiting.
 */
export function resolveSmartTalkRateLimitClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}
