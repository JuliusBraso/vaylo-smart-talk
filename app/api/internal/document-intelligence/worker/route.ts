import { NextRequest, NextResponse } from "next/server";
import {
  createRequestId,
  internalErrorResponse,
  logRouteError,
} from "@/lib/api/safe-error-response";
import { runDocumentIntelligenceCronRun } from "@/lib/vaylo/documents/run-document-intelligence-cron-run";

export const runtime = "nodejs";

function hasValidSecret(req: NextRequest): boolean {
  const provided = req.headers.get("x-cron-secret") ?? "";
  const expected = process.env.CRON_SECRET ?? "";
  return expected.length > 0 && provided === expected;
}

function clampInt(
  raw: string | null,
  defaults: { min: number; max: number; fallback: number },
): number {
  if (!raw) return defaults.fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return defaults.fallback;
  const value = Math.trunc(parsed);
  return Math.min(defaults.max, Math.max(defaults.min, value));
}

export async function POST(req: NextRequest) {
  if (!hasValidSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const maxJobs = clampInt(req.nextUrl.searchParams.get("maxJobs"), {
    min: 1,
    max: 25,
    fallback: 10,
  });
  const maxDurationMs = clampInt(req.nextUrl.searchParams.get("maxDurationMs"), {
    min: 1_000,
    max: 25_000,
    fallback: 8_000,
  });

  try {
    const summary = await runDocumentIntelligenceCronRun({
      maxJobs,
      maxDurationMs,
    });

    return NextResponse.json(summary);
  } catch (error) {
    const requestId = createRequestId();
    logRouteError("[doc-int worker route]", requestId, error);
    return internalErrorResponse({ requestId, status: 500, debugError: error });
  }
}

export async function GET(req: NextRequest) {
  // Allow GET for simple cron providers; same auth requirement.
  return POST(req);
}

