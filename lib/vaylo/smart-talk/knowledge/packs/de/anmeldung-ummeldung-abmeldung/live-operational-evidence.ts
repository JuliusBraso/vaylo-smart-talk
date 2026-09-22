import "server-only";

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export type LiveOperationalFailureStage =
  | "source_validation" | "dns" | "fetch" | "http_status" | "content_type"
  | "body_limit" | "normalization" | "extraction";

export type LiveSourceAuthorization = Readonly<{
  canonicalUrl: string;
  officialDomain: string;
  normalizedOrigin: string;
}>;

export type LiveOperationalDependencies = Readonly<{
  resolveAddresses: (hostname: string, signal?: AbortSignal) => Promise<readonly string[]>;
  fetch: typeof fetch;
  now: () => Date;
}>;

export class KnowledgePreparationCancelledError extends Error {
  constructor() {
    super("knowledge_preparation_cancelled");
    this.name = "KnowledgePreparationCancelledError";
  }
}

export function isKnowledgePreparationCancelled(error: unknown): boolean {
  return error instanceof KnowledgePreparationCancelledError;
}

export function throwIfKnowledgePreparationCancelled(signal?: AbortSignal): void {
  if (signal?.aborted) throw new KnowledgePreparationCancelledError();
}

export type LiveOpeningHoursResult =
  | Readonly<{
      ok: true;
      valueText: string;
      sourceUrl: string;
      officialDomain: string;
      fetchedAt: string;
      sourceValidated: true;
      fetchAttempted: true;
      fetchSucceeded: true;
      extractionSucceeded: true;
    }>
  | Readonly<{
      ok: false;
      failureStage: LiveOperationalFailureStage;
      sourceValidated: boolean;
      fetchAttempted: boolean;
      fetchSucceeded: boolean;
      extractionSucceeded: false;
    }>;

const MAX_BYTES = 256 * 1024;
export const LIVE_OPENING_HOURS_MAX_BYTES = MAX_BYTES;

const DEFAULT_DEPENDENCIES: LiveOperationalDependencies = {
  resolveAddresses: async (hostname) => (await lookup(hostname, { all: true, verbatim: true }))
    .map((entry) => entry.address),
  fetch,
  now: () => new Date(),
};

function normalizedHostname(value: string): string {
  return value.toLowerCase().replace(/^\[|\]$/g, "");
}

function forbiddenIpv4(address: string): boolean {
  const octets = address.split(".").map(Number);
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return true;
  const [a, b] = octets;
  return a === 0 || a === 10 || a === 127
    || (a === 100 && b >= 64 && b <= 127)
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && (b === 0 || b === 168))
    || (a === 198 && (b === 18 || b === 19 || b === 51))
    || (a === 203 && b === 0)
    || a >= 224;
}

export function isForbiddenLiveTargetAddress(address: string): boolean {
  const normalized = normalizedHostname(address);
  const version = isIP(normalized);
  if (version === 4) return forbiddenIpv4(normalized);
  if (version !== 6) return true;
  if (normalized.startsWith("::ffff:")) {
    return forbiddenIpv4(normalized.slice("::ffff:".length));
  }
  return normalized === "::" || normalized === "::1"
    || /^(?:fc|fd|fe8|fe9|fea|feb|ff)/i.test(normalized)
    || normalized.startsWith("2001:db8:");
}

function validateSource(source: LiveSourceAuthorization): URL | null {
  try {
    const url = new URL(source.canonicalUrl);
    const origin = new URL(source.normalizedOrigin);
    const hostname = normalizedHostname(url.hostname);
    return url.protocol === "https:"
      && !url.username && !url.password
      && (url.port === "" || url.port === "443")
      && hostname !== "localhost"
      && hostname === normalizedHostname(source.officialDomain)
      && url.origin === origin.origin
      && origin.protocol === "https:"
      && !origin.username && !origin.password
      && normalizedHostname(origin.hostname) === hostname
      && (origin.port === "" || origin.port === "443")
      ? url
      : null;
  } catch {
    return null;
  }
}

async function awaitWithCallerCancellation<T>(
  operation: Promise<T>,
  signal?: AbortSignal,
): Promise<T> {
  // Own the Promise before any cancellation throw. Its creator may already
  // have aborted while producing this settled or rejected Promise.
  const settled = operation.then(
    (value) => ({ status: "fulfilled" as const, value }),
    (error: unknown) => ({ status: "rejected" as const, error }),
  );
  throwIfKnowledgePreparationCancelled(signal);
  if (!signal) {
    const result = await settled;
    if (result.status === "rejected") throw result.error;
    return result.value;
  }
  let removeListener: () => void = () => undefined;
  const cancelled = new Promise<void>((resolve) => {
    const onAbort = () => resolve();
    signal.addEventListener("abort", onAbort, { once: true });
    removeListener = () => signal.removeEventListener("abort", onAbort);
    if (signal.aborted) onAbort();
  });
  try {
    const winner = await Promise.race([
      settled.then((result) => ({ kind: "settled" as const, result })),
      cancelled.then(() => ({ kind: "cancelled" as const })),
    ]);
    if (winner.kind === "cancelled" || signal.aborted) {
      throw new KnowledgePreparationCancelledError();
    }
    if (winner.result.status === "rejected") throw winner.result.error;
    return winner.result.value;
  } finally {
    removeListener();
  }
}

function combinedTimeoutSignal(
  callerSignal: AbortSignal | undefined,
  timeoutMs: number,
): Readonly<{ signal: AbortSignal; cleanup: () => void; callerCancelled: () => boolean }> {
  const controller = new AbortController();
  let callerCancellationObserved = false;
  const onCallerAbort = () => {
    callerCancellationObserved = true;
    controller.abort();
  };
  if (callerSignal) {
    callerSignal.addEventListener("abort", onCallerAbort, { once: true });
    if (callerSignal.aborted) onCallerAbort();
  }
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return {
    signal: controller.signal,
    callerCancelled: () => callerCancellationObserved || callerSignal?.aborted === true,
    cleanup: () => {
      clearTimeout(timer);
      callerSignal?.removeEventListener("abort", onCallerAbort);
    },
  };
}

export function normalizeLiveOpeningHoursHtml(html: string): string {
  return html
    .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<(?:br|\/p|\/div|\/li|\/tr|\/h[1-6])\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/[^\S\r\n]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim()
    .slice(0, 20_000);
}

export function extractLiveOpeningHours(text: string): string | null {
  const lines = text.split(/\n|(?<=[.!?])\s+/).map((line) => line.trim()).filter((line) =>
    line.length <= 600
      && /(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|uhr|öffnungszeit)/i.test(line)
      && /\b(?:[01]?\d|2[0-3])[:.]\d{2}\b/.test(line),
  );
  const value = [...new Set(lines)].join(" ").trim().slice(0, 1_200);
  return value || null;
}

async function readBoundedBody(response: Response, signal?: AbortSignal): Promise<string | null> {
  throwIfKnowledgePreparationCancelled(signal);
  const declared = Number(response.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BYTES) {
    await response.body?.cancel().catch(() => undefined);
    return null;
  }
  if (!response.body) {
    const body = await awaitWithCallerCancellation(response.text(), signal);
    throwIfKnowledgePreparationCancelled(signal);
    return Buffer.byteLength(body) <= MAX_BYTES ? body : null;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let body = "";
  const onAbort = () => {
    void reader.cancel().catch(() => undefined);
  };
  signal?.addEventListener("abort", onAbort, { once: true });
  if (signal?.aborted) onAbort();
  try {
    while (true) {
      throwIfKnowledgePreparationCancelled(signal);
      const part = await reader.read();
      throwIfKnowledgePreparationCancelled(signal);
      if (part.done) break;
      total += part.value.byteLength;
      if (total > MAX_BYTES) {
        await reader.cancel().catch(() => undefined);
        return null;
      }
      body += decoder.decode(part.value, { stream: true });
    }
    return body + decoder.decode();
  } finally {
    signal?.removeEventListener("abort", onAbort);
    reader.releaseLock();
  }
}

export async function fetchLiveOpeningHours(
  source: LiveSourceAuthorization,
  dependencies: LiveOperationalDependencies = DEFAULT_DEPENDENCIES,
  signal?: AbortSignal,
): Promise<LiveOpeningHoursResult> {
  throwIfKnowledgePreparationCancelled(signal);
  const url = validateSource(source);
  if (!url) {
    return {
      ok: false, failureStage: "source_validation", sourceValidated: false,
      fetchAttempted: false, fetchSucceeded: false, extractionSucceeded: false,
    };
  }
  let addresses: readonly string[];
  try {
    throwIfKnowledgePreparationCancelled(signal);
    addresses = isIP(normalizedHostname(url.hostname))
      ? [normalizedHostname(url.hostname)]
      : await awaitWithCallerCancellation(
          dependencies.resolveAddresses(normalizedHostname(url.hostname), signal),
          signal,
        );
    throwIfKnowledgePreparationCancelled(signal);
  } catch (error) {
    if (isKnowledgePreparationCancelled(error)) throw error;
    return {
      ok: false, failureStage: "dns", sourceValidated: true,
      fetchAttempted: false, fetchSucceeded: false, extractionSucceeded: false,
    };
  }
  throwIfKnowledgePreparationCancelled(signal);
  if (addresses.length === 0 || addresses.some(isForbiddenLiveTargetAddress)) {
    return {
      ok: false, failureStage: "dns", sourceValidated: true,
      fetchAttempted: false, fetchSucceeded: false, extractionSucceeded: false,
    };
  }
  let response: Response;
  const requestCancellation = combinedTimeoutSignal(signal, 7_000);
  try {
    if (requestCancellation.callerCancelled()) throw new KnowledgePreparationCancelledError();
    response = await dependencies.fetch(url, {
      redirect: "manual",
      signal: requestCancellation.signal,
      headers: { Accept: "text/html" },
      credentials: "omit",
    });
    if (requestCancellation.callerCancelled()) throw new KnowledgePreparationCancelledError();
  } catch (error) {
    requestCancellation.cleanup();
    if (requestCancellation.callerCancelled() || isKnowledgePreparationCancelled(error)) {
      throw new KnowledgePreparationCancelledError();
    }
    return {
      ok: false, failureStage: "fetch", sourceValidated: true,
      fetchAttempted: true, fetchSucceeded: false, extractionSucceeded: false,
    };
  }
  throwIfKnowledgePreparationCancelled(signal);
  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    const callerCancelled = requestCancellation.callerCancelled();
    requestCancellation.cleanup();
    if (callerCancelled) throw new KnowledgePreparationCancelledError();
    return {
      ok: false,
      failureStage: response.status >= 300 && response.status < 400 ? "fetch" : "http_status",
      sourceValidated: true, fetchAttempted: true, fetchSucceeded: true, extractionSucceeded: false,
    };
  }
  if (!/^text\/html(?:;|$)/i.test(response.headers.get("content-type") ?? "")) {
    await response.body?.cancel().catch(() => undefined);
    const callerCancelled = requestCancellation.callerCancelled();
    requestCancellation.cleanup();
    if (callerCancelled) throw new KnowledgePreparationCancelledError();
    return {
      ok: false, failureStage: "content_type", sourceValidated: true,
      fetchAttempted: true, fetchSucceeded: true, extractionSucceeded: false,
    };
  }
  let body: string | null;
  try {
    body = await readBoundedBody(response, requestCancellation.signal);
    if (requestCancellation.callerCancelled()) throw new KnowledgePreparationCancelledError();
  } catch {
    requestCancellation.cleanup();
    if (requestCancellation.callerCancelled()) throw new KnowledgePreparationCancelledError();
    return {
      ok: false, failureStage: "fetch", sourceValidated: true,
      fetchAttempted: true, fetchSucceeded: true, extractionSucceeded: false,
    };
  }
  requestCancellation.cleanup();
  throwIfKnowledgePreparationCancelled(signal);
  if (body === null) {
    return {
      ok: false, failureStage: "body_limit", sourceValidated: true,
      fetchAttempted: true, fetchSucceeded: true, extractionSucceeded: false,
    };
  }
  const text = normalizeLiveOpeningHoursHtml(body);
  if (!text) {
    return {
      ok: false, failureStage: "normalization", sourceValidated: true,
      fetchAttempted: true, fetchSucceeded: true, extractionSucceeded: false,
    };
  }
  const valueText = extractLiveOpeningHours(text);
  if (!valueText) {
    return {
      ok: false, failureStage: "extraction", sourceValidated: true,
      fetchAttempted: true, fetchSucceeded: true, extractionSucceeded: false,
    };
  }
  return {
    ok: true,
    valueText,
    sourceUrl: url.toString(),
    officialDomain: normalizedHostname(url.hostname),
    fetchedAt: dependencies.now().toISOString(),
    sourceValidated: true,
    fetchAttempted: true,
    fetchSucceeded: true,
    extractionSucceeded: true,
  };
}
