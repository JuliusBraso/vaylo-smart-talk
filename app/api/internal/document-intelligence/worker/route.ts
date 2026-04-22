import { NextRequest, NextResponse } from "next/server";
import { runDocumentIntelligenceCronRun } from "@/lib/vaylo/documents/run-document-intelligence-cron-run";

export const runtime = "nodejs";

function hasValidSecret(req: NextRequest): boolean {
  const provided = req.headers.get("x-cron-secret") ?? "";
  const expected = process.env.CRON_SECRET ?? "";
  return expected.length > 0 && provided === expected;
}

export async function POST(req: NextRequest) {
  if (!hasValidSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const maxJobsRaw = req.nextUrl.searchParams.get("maxJobs");
  const maxDurationRaw = req.nextUrl.searchParams.get("maxDurationMs");
  const maxJobs = maxJobsRaw ? Number(maxJobsRaw) : undefined;
  const maxDurationMs = maxDurationRaw ? Number(maxDurationRaw) : undefined;

  const summary = await runDocumentIntelligenceCronRun({
    maxJobs: Number.isFinite(maxJobs) ? maxJobs : undefined,
    maxDurationMs: Number.isFinite(maxDurationMs) ? maxDurationMs : undefined,
  });

  return NextResponse.json(summary);
}

export async function GET(req: NextRequest) {
  // Allow GET for simple cron providers; same auth requirement.
  return POST(req);
}

