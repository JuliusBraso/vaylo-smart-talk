import type { CueHit, CueHitSource } from "../evidence-gates-types";
import type { EvidenceLevel, ProceduralLane } from "../types";

const PROCEDURAL_LANES = new Set<ProceduralLane>([
  "payment",
  "appeal",
  "submission",
  "appointment",
  "informational",
  "escalation",
  "clarification",
]);

const EVIDENCE_LEVELS = new Set<EvidenceLevel>([
  "explicit",
  "strongly_supported",
  "contextual",
  "speculative",
]);

function clamp01(n: number): number {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function normalizeLane(lane: ProceduralLane | undefined): ProceduralLane | undefined {
  if (lane === undefined) return undefined;
  return PROCEDURAL_LANES.has(lane) ? lane : undefined;
}

function normalizeEvidenceLevel(level: EvidenceLevel | undefined): EvidenceLevel | undefined {
  if (level === undefined) return undefined;
  return EVIDENCE_LEVELS.has(level) ? level : undefined;
}

/**
 * Pure sanitization of externally supplied cue hits (8.2C-3).
 *
 * Does not read `documentText`, execute regex, infer lanes, or infer evidence levels.
 */
export function normalizeCueHits(cueHits: readonly CueHit[] | undefined): CueHit[] {
  if (!cueHits?.length) return [];

  const out: CueHit[] = [];

  for (const hit of cueHits) {
    const cueId = typeof hit.cueId === "string" ? hit.cueId.trim() : "";
    if (!cueId) continue;

    const source: CueHitSource = hit.source ?? "manual";

    let confidence: number | undefined;
    if (typeof hit.confidence === "number" && Number.isFinite(hit.confidence)) {
      confidence = clamp01(hit.confidence);
    }

    const lane = normalizeLane(hit.lane);
    const evidenceLevel = normalizeEvidenceLevel(hit.evidenceLevel);

    let startOffset = hit.startOffset ?? hit.span?.start;
    let endOffset = hit.endOffset ?? hit.span?.end;
    const notes: string[] = hit.notes ? [...hit.notes] : [];

    const startOk = typeof startOffset === "number" && Number.isFinite(startOffset);
    const endOk = typeof endOffset === "number" && Number.isFinite(endOffset);
    if (!startOk) startOffset = undefined;
    if (!endOk) endOffset = undefined;

    if (startOffset !== undefined && endOffset !== undefined && endOffset < startOffset) {
      startOffset = undefined;
      endOffset = undefined;
      notes.push("offset_range_inverted_dropped");
    } else if (startOffset !== undefined && endOffset === undefined) {
      startOffset = undefined;
    } else if (startOffset === undefined && endOffset !== undefined) {
      endOffset = undefined;
    }

    let matchedText: string | undefined;
    if (typeof hit.matchedText === "string") {
      const t = hit.matchedText.trim();
      if (t.length > 0) matchedText = t;
    }

    const row: CueHit = {
      cueId,
      source,
      ...(confidence !== undefined ? { confidence } : {}),
      ...(lane !== undefined ? { lane } : {}),
      ...(evidenceLevel !== undefined ? { evidenceLevel } : {}),
      ...(startOffset !== undefined ? { startOffset } : {}),
      ...(endOffset !== undefined ? { endOffset } : {}),
      ...(matchedText !== undefined ? { matchedText } : {}),
      ...(notes.length > 0 ? { notes } : {}),
      ...(hit.ocrFragile !== undefined ? { ocrFragile: hit.ocrFragile } : {}),
    };

    out.push(row);
  }

  return out;
}
