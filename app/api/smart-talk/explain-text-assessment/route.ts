import { NextResponse } from "next/server";
import { assessExplainTextCandidate } from "@/lib/vaylo/smart-talk/pii/explain-text-controlled-assessment";
import type {
  ExplainTextAssessmentCode,
  ExplainTextRedactionFindings,
} from "@/lib/vaylo/smart-talk/pii/explain-text-controlled-assessment";
import { runRuntimeInternalAuthGuard } from "@/lib/vaylo/smart-talk/reality-matrix/runtime-internal-auth-guard";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 64 * 1024;

const CLOSED_BODY = {
  code: "closed",
  redactionFindings: "unavailable",
  modelCallPermitted: false,
  readyForModel: false,
  textTreatedAsAnonymous: false,
  paymentAuthorized: false,
  publicProcessingPermitted: false,
} as const;

function acceptsJsonContentType(header: string | null): boolean {
  if (!header) return false;
  const pieces = header.split(";");
  const mediaType = pieces[0]?.trim().toLowerCase();
  if (mediaType !== "application/json") return false;
  for (let index = 1; index < pieces.length; index += 1) {
    const piece = pieces[index].trim();
    if (piece.length === 0) continue;
    const separator = piece.indexOf("=");
    const name = (separator === -1 ? piece : piece.slice(0, separator)).trim().toLowerCase();
    if (name !== "charset") return false;
  }
  return true;
}

function acceptedAssessment(value: unknown): {
  code: "precheck_blocked" | "needs_user_revision" | "no_supported_signal";
  redactionFindings: "not_run" | "none" | "present" | "unavailable";
} | null {
  if (!value || typeof value !== "object") return null;
  const code = (value as { code?: unknown }).code;
  const findings = (value as { redactionFindings?: unknown }).redactionFindings;
  const knownCode =
    code === "precheck_blocked" ? "precheck_blocked" :
    code === "needs_user_revision" ? "needs_user_revision" :
    code === "no_supported_signal" ? "no_supported_signal" :
    null;
  const knownFindings =
    findings === "not_run" ? "not_run" :
    findings === "none" ? "none" :
    findings === "present" ? "present" :
    findings === "unavailable" ? "unavailable" :
    null;
  if (!knownCode || !knownFindings) return null;
  return { code: knownCode, redactionFindings: knownFindings };
}

function sealed(
  status: number,
  code: ExplainTextAssessmentCode = CLOSED_BODY.code,
  redactionFindings: ExplainTextRedactionFindings = CLOSED_BODY.redactionFindings,
) {
  return NextResponse.json(
    {
      code,
      redactionFindings,
      modelCallPermitted: false,
      readyForModel: false,
      textTreatedAsAnonymous: false,
      paymentAuthorized: false,
      publicProcessingPermitted: false,
    },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

async function readLimitedBody(req: Request): Promise<Uint8Array | null> {
  const body = req.body;
  if (!body) return new Uint8Array();
  const reader = body.getReader();
  const parts: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const step = await reader.read();
      if (step.done) break;
      const chunk = step.value;
      if (!chunk || chunk.byteLength === 0) continue;
      total += chunk.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      parts.push(chunk);
    }
  } catch {
    await reader.cancel().catch(() => undefined);
    return null;
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.byteLength;
  }
  return bytes;
}

function candidateTextFromJson(bytes: Uint8Array): string | null {
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const record = parsed as Record<string, unknown>;
  if (Object.keys(record).length !== 1 || !Object.prototype.hasOwnProperty.call(record, "candidateText")) {
    return null;
  }
  const candidateText = record.candidateText;
  if (typeof candidateText !== "string") return null;
  return candidateText;
}

export async function POST(req: Request) {
  const auth = runRuntimeInternalAuthGuard({
    providedSecret: req.headers.get("x-vaylo-internal-runtime-secret"),
    expectedSecret: process.env.VAYLO_INTERNAL_RUNTIME_SECRET,
  });
  if (!auth.authorised) {
    return sealed(403);
  }
  if (!acceptsJsonContentType(req.headers.get("content-type"))) {
    return sealed(415);
  }

  const bytes = await readLimitedBody(req);
  if (!bytes) return sealed(413);

  const candidateText = candidateTextFromJson(bytes);
  if (candidateText === null) return sealed(400);

  try {
    const assessed = acceptedAssessment(assessExplainTextCandidate(candidateText));
    if (!assessed) return sealed(500);
    return sealed(200, assessed.code, assessed.redactionFindings);
  } catch {
    return sealed(500);
  }
}
