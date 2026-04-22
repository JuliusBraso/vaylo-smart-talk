/**
 * Manual runner for document intelligence jobs (Phase 3.7).
 *
 * Usage:
 *   npm run docs:worker -- --max 10
 *   npm run docs:requeue-stale
 */
import { runDocumentIntelligenceWorkerOnce } from "@/lib/vaylo/documents/process-document-intelligence-job";
import { reprocessStaleDocumentIntelligenceJobs } from "@/lib/vaylo/documents/reprocess-stale-document-intelligence-jobs";

function parseArg(name: string): string | null {
  const idx = process.argv.findIndex((a) => a === name);
  if (idx < 0) return null;
  return process.argv[idx + 1] ?? null;
}

async function main() {
  const mode = parseArg("--mode") ?? "worker";
  if (mode === "requeue-stale") {
    await reprocessStaleDocumentIntelligenceJobs();
    return;
  }

  const max = Number(parseArg("--max") ?? "5");
  const limit = Number.isFinite(max) && max > 0 ? Math.floor(max) : 5;

  for (let i = 0; i < limit; i++) {
    const res = await runDocumentIntelligenceWorkerOnce();
    if (!res.processed) break;
  }
}

main().catch((e) => {
  console.error("[docs worker ERROR]", e);
  process.exitCode = 1;
});

