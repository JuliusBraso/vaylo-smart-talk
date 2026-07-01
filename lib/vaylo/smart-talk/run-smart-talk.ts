import {
  buildSmartTalkMessages,
  deriveSmartTalkReasoningProtocol,
  type SmartTalkInputType,
  type SmartTalkLocale,
  type SmartTalkReasoningProtocol,
  type SmartTalkTextSource,
} from "./build-smart-talk-prompt";
// [TD-002] containment seam import — disabled-by-default — no production authorization
import { runEvidenceGatesRuntimeAdapterDryRun } from "./reality-matrix/live-input/run-controlled-real-document-evidence-gates-runtime-adapter-dry-run-implementation";

export type { SmartTalkTextSource } from "./build-smart-talk-prompt";

export type SmartTalkUrgency = "low" | "medium" | "high" | "unknown";

export type SmartTalkConfidenceLevel = "low" | "medium" | "high";

export type SmartTalkConsequencePhase = "none" | "possible" | "conditional" | "active";

export type SmartTalkDocumentQuality = "clear" | "noisy" | "ocr_damaged" | "unknown";

export type SmartTalkDocumentKind =
  | "payment_notice"
  | "direct_debit_notice"
  | "reminder_dunning"
  | "official_decision"
  | "hearing_procedural"
  | "approval_grant"
  | "rejection_refusal"
  | "informational_status"
  | "contribution_or_tax_assessment"
  | "demand_repayment"
  | "termination"
  | "generic_request"
  | "unknown";

export type SmartTalkDomain =
  | "insurance"
  | "health_insurance"
  | "tax"
  | "social_benefits"
  | "residence"
  | "municipal"
  | "debt_collection"
  | "family_benefits"
  | "employment"
  | "unknown";

export type SmartTalkPaymentChannel =
  | "sepa_direct_debit"
  | "manual_transfer"
  | "unclear"
  | "not_applicable";

export type SmartTalkProceduralState =
  | "informational"
  | "action_required"
  | "response_possible"
  | "decision_issued"
  | "payment_required"
  | "deadline_active"
  | "unknown";

export type SmartTalkLegalSeverity = "none" | "low" | "medium" | "high" | "critical";

export type SmartTalkResult = {
  summary: string;
  meaning: string;
  urgency: SmartTalkUrgency;
  nextSteps: string[];
  warnings: string[];
  stabilizers: string[];
  confidenceLevel: SmartTalkConfidenceLevel;
  consequencePhase: SmartTalkConsequencePhase;
  documentQuality: SmartTalkDocumentQuality;
  documentKind: SmartTalkDocumentKind;
  domain: SmartTalkDomain;
  documentTypeLabel: string;
  paymentChannel: SmartTalkPaymentChannel;
  proceduralState: SmartTalkProceduralState;
  legalSeverity: SmartTalkLegalSeverity;
  deadlines: string[];
  rights: string[];
  obligations: string[];
  consequences: string[];
};

const DEFAULT_MODEL = "gpt-4o-mini";
const URGENCY_SET = new Set<string>(["low", "medium", "high", "unknown"]);
const CONFIDENCE_SET = new Set<string>(["low", "medium", "high"]);
const CONSEQUENCE_SET = new Set<string>(["none", "possible", "conditional", "active"]);
const DOCUMENT_QUALITY_SET = new Set<string>(["clear", "noisy", "ocr_damaged", "unknown"]);

const DOCUMENT_KIND_SET = new Set<string>([
  "payment_notice",
  "direct_debit_notice",
  "reminder_dunning",
  "official_decision",
  "hearing_procedural",
  "approval_grant",
  "rejection_refusal",
  "informational_status",
  "contribution_or_tax_assessment",
  "demand_repayment",
  "termination",
  "generic_request",
  "unknown",
]);

const DOMAIN_SET = new Set<string>([
  "insurance",
  "health_insurance",
  "tax",
  "social_benefits",
  "residence",
  "municipal",
  "debt_collection",
  "family_benefits",
  "employment",
  "unknown",
]);

const PAYMENT_CHANNEL_SET = new Set<string>([
  "sepa_direct_debit",
  "manual_transfer",
  "unclear",
  "not_applicable",
]);

const PROCEDURAL_STATE_SET = new Set<string>([
  "informational",
  "action_required",
  "response_possible",
  "decision_issued",
  "payment_required",
  "deadline_active",
  "unknown",
]);

const LEGAL_SEVERITY_SET = new Set<string>(["none", "low", "medium", "high", "critical"]);

const DEFAULT_STABILIZERS: string[] = [];
const DEFAULT_CONFIDENCE: SmartTalkConfidenceLevel = "medium";
const DEFAULT_CONSEQUENCE: SmartTalkConsequencePhase = "possible";
const DEFAULT_DOCUMENT_QUALITY: SmartTalkDocumentQuality = "unknown";

function stripJsonFence(s: string): string {
  const t = s.trim();
  if (!t.startsWith("```")) return t;
  return t
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

function parseStringArray(raw: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const x of raw) {
    if (typeof x !== "string") continue;
    const s = x.trim().slice(0, maxLen);
    if (s) out.push(s);
    if (out.length >= maxItems) break;
  }
  return out;
}

function normalizeDocumentTypeLabel(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.trim().slice(0, 200);
}

const DEADLINE_CUE_WINDOW_CHARS = 200;

/** German (and OCR-tolerant) substrings; matching is case-insensitive on source slices. */
const GERMAN_DEADLINE_CUE_FRAGMENTS: readonly string[] = [
  "frist",
  "innerhalb",
  "einspruch",
  "widerspruch",
  "rechtsbehelf",
  "rechtsbehelfsbelehrung",
  "bekanntgabe",
  "zahlung",
  "zahlen",
  "zahlbar",
  "zahlungs",
  "spätestens",
  "spaetestens",
  "bis zum",
  "bis spätestens",
  "bis spaetestens",
  "fälligkeit",
  "falligkeit",
  "faelligkeit",
  "fällig",
  "fallig",
  "faellig",
  "mahnung",
  "säumnis",
  "saumnis",
  "säumniszuschlag",
  "saumniszuschlag",
  "vollstreckung",
  "nachreichung",
  "unterlagen",
  "mitwirkung",
  "termin",
  "bitte zahlen",
];

function uniqueCalendarTokens(text: string): string[] {
  const eu = [...text.matchAll(/\b\d{1,2}\.\d{1,2}\.\d{4}\b/g)].map((m) => m[0]);
  const iso = [...text.matchAll(/\b\d{4}-\d{2}-\d{2}\b/g)].map((m) => m[0]);
  return [...new Set([...eu, ...iso])];
}

function sourceSliceHasDeadlineCue(slice: string): boolean {
  const normalized = slice.toLowerCase();
  for (const cue of GERMAN_DEADLINE_CUE_FRAGMENTS) {
    if (normalized.includes(cue)) return true;
  }
  return false;
}

/**
 * True if at least one occurrence of `token` in `source` lies within a window
 * that also contains a deadline/payment/procedural cue (7.8C).
 */
function dateTokenOccurrenceCueGroundedInSource(token: string, source: string): boolean {
  let from = 0;
  while (from <= source.length) {
    const i = source.indexOf(token, from);
    if (i === -1) break;
    const start = Math.max(0, i - DEADLINE_CUE_WINDOW_CHARS);
    const end = Math.min(source.length, i + token.length + DEADLINE_CUE_WINDOW_CHARS);
    if (sourceSliceHasDeadlineCue(source.slice(start, end))) return true;
    from = i + 1;
  }
  return false;
}

/** Phase 7.9C — procedural lanes (internal); isolate payment vs appeal vs submission vs appointment. */
type ProceduralLane = "payment" | "appeal" | "submission" | "appointment";

const GENERATED_LANE_SCAN_RADIUS_CHARS = 110;

const LANE_PAYMENT_CUES: readonly string[] = [
  "zahlen",
  "zahlung",
  "zahlbar",
  "fälligkeit",
  "falligkeit",
  "faelligkeit",
  "säumnis",
  "saumnis",
  "säumniszuschlag",
  "saumniszuschlag",
  "vollstreckung",
  "überweisung",
  "ueberweisung",
  "lastschrift",
  "abbuchung",
  "steuer zahlen",
  "bitte zahlen",
  "zaplatiť",
  "zaplatit",
  "platba",
  "úhrada",
  "uhrada",
  "splatnosť",
  "splatnost",
  "omeškanie",
  "omeskanie",
  "poplatok",
  "prevod",
  "uhradiť",
  "daň zaplatiť",
  "dan zaplatit",
];

const LANE_APPEAL_CUES: readonly string[] = [
  "einspruch",
  "rechtsbehelf",
  "rechtsbehelfsbelehrung",
  "bekanntgabe",
  "widerspruch",
  "anfechtung",
  "odvolanie",
  "námietka",
  "namietka",
  "poučenie",
  "poucenie",
  "napadnúť rozhodnutie",
  "napadnut rozhodnutie",
];

const LANE_SUBMISSION_CUES: readonly string[] = [
  "unterlagen",
  "nachreichen",
  "mitwirkung",
  "einreichen",
  "abgeben",
  "doložiť",
  "dolozit",
  "predložiť",
  "predlozit",
  "odoslať dokumenty",
  "odoslat dokumenty",
];

const LANE_APPOINTMENT_CUES: readonly string[] = [
  "termin",
  "vorsprache",
  "erscheinen",
  "termín",
  "dostaviť sa",
  "dostavit sa",
];

const LANE_ORDER: readonly ProceduralLane[] = ["payment", "appeal", "submission", "appointment"];

/** Appeal-relative wording must not appear in payment-focused fragments (Phase 7.9C leakage guard). */
const APPEAL_RELATIVE_PHRASE_LEAK_PATTERNS: ReadonlyArray<RegExp> = [
  /\binnerhalb eines Monats nach Bekanntgabe\b/giu,
  /do jedného mesiaca od doručenia rozhodnutia/giu,
  /\bdo jedného mesiaca od doručenia\b/giu,
  /\bjedného mesiaca od doručenia rozhodnutia\b/giu,
  /\bjeden mesiac od doručenia\b/giu,
  /\bjedného mesiaca od doručenia\b/giu,
  /do jedného mesiaca od oznámenia/giu,
  /\bjedného mesiaca od oznámenia\b/giu,
  /\bwithin one month of notification of the decision\b/giu,
];

type FabricationPatternGroup = Readonly<{ patterns: readonly RegExp[]; sourceCues: readonly string[] }>;

/** Phase 7.9D — invented enforcement / escalation / post-deadline timing narration. */
const FABRICATION_PATTERN_GROUPS: readonly FabricationPatternGroup[] = [
  {
    patterns: [
      /\bvymáhan(?:ie|ia|iu|í)\b/giu,
      /\bexekúcia\b/giu,
      /\bexekucia\b/giu,
      /\badministratívne opatrenia\b/giu,
      /\badministrativne opatrenia\b/giu,
      /\bnútený výkon\b/giu,
      /\bnuteny vykon\b/giu,
      /\bvollstreckung\b/giu,
      /\bzwangsvollstreckung\b/giu,
      /\bforced enforcement\b/giu,
      /\bcompulsory execution\b/giu,
    ],
    sourceCues: ["vollstreckung", "zwangsvollstreckung"],
  },
  {
    patterns: [
      /\bďalší krok konania\b/giu,
      /\bdalsi krok konania\b/giu,
      /\bnasledujúca fáza\b/giu,
      /\bnasledujuca fazu\b/giu,
      /\bautomaticky dôjde\b/giu,
      /\bautomaticky dojde\b/giu,
      /\bnächste verfahrensstufe\b/giu,
      /\bautomatisch erfolgt\b/giu,
      /\bsubsequent stage of proceedings\b/giu,
      /\bnext procedural stage\b/giu,
    ],
    sourceCues: [
      "verfahrensstufe",
      "verfahrensstufen",
      "automatisch erfolgt",
      "folgeverfahren",
      "weiterverfahren",
      "nächste stufe",
    ],
  },
  {
    patterns: [
      /\bpo lehote splatnosti\b/giu,
      /\bdo jedného mesiaca po lehote\b/giu,
      /\bdo jedneho mesiaca po lehote\b/giu,
      /\bv ďalšej fáze\b/giu,
      /\bpo uplynutí splatnosti\b/giu,
      /\bafter the payment deadline\b/giu,
      /\bone month after expiry\b/giu,
      /\bone month after expiration\b/giu,
    ],
    sourceCues: [
      "nach ablauf der zahlungsfrist",
      "nach ablauf der frist",
      "nach der fälligkeit",
      "nach der falligkeit",
      "ein monat nach",
      "einen monat nach",
      "einem monat nach",
      "ein monats nach",
    ],
  },
];

function fabricationCueGrounded(sourceLower: string, cues: readonly string[]): boolean {
  return cues.some((cue) => sourceLower.includes(cue.toLowerCase()));
}

function proceduralLiteralismFallback(locale: SmartTalkLocale | undefined, round: number): string {
  const i = ((round % 3) + 3) % 3;
  if (locale === "de") {
    const phrases = [
      "Das Dokument beschreibt keine weiteren Schritte.",
      "Das Dokument geht hier nicht weiter auf mögliche Folgen ein.",
      "Das Dokument enthält hierzu nur die ausgedrückten Angaben.",
    ];
    return phrases[i];
  }
  if (locale === "en") {
    const phrases = [
      "The document does not describe further steps.",
      "The document does not elaborate on additional consequences.",
      "The document only states what is expressly written.",
    ];
    return phrases[i];
  }
  const phrases = [
    "Dokument neuvádza ďalší postup.",
    "Dokument bližšie nerozvádza ďalšie následky.",
    "Dokument uvádza len základné informácie o postupe.",
  ];
  return phrases[i];
}

function sanitizeProceduralFabricationPatterns(
  text: string,
  source: string,
  locale?: SmartTalkLocale,
): string {
  if (!text || !source.trim()) return text;
  const srcLower = source.toLowerCase();
  let out = text;
  let iterations = 0;
  while (iterations++ < 100) {
    let bestIdx = Infinity;
    let bestLen = 0;
    let found = false;

    for (const group of FABRICATION_PATTERN_GROUPS) {
      for (const proto of group.patterns) {
        const r = new RegExp(proto.source, proto.flags.includes("g") ? proto.flags : `${proto.flags}g`);
        const m = r.exec(out);
        if (!m) continue;
        if (fabricationCueGrounded(srcLower, group.sourceCues)) continue;
        const idx = m.index ?? 0;
        if (!found || idx < bestIdx || (idx === bestIdx && m[0].length > bestLen)) {
          bestIdx = idx;
          bestLen = m[0].length;
          found = true;
        }
      }
    }

    if (!found || bestIdx === Infinity) break;

    const insert = proceduralLiteralismFallback(locale, iterations);
    out = `${out.slice(0, bestIdx)}${insert}${out.slice(bestIdx + bestLen)}`;
  }

  return out.replace(/ {2,}/g, " ").trim();
}
function countDistinctLaneCueHits(haystackLower: string, cues: readonly string[]): number {
  let n = 0;
  for (const cue of cues) {
    if (haystackLower.includes(cue.toLowerCase())) n += 1;
  }
  return n;
}

/** Strongest lane by cue hits; ties PAYMENT > APPEAL > SUBMISSION > APPOINTMENT (Phase 7.9C). */
function detectProceduralLane(fragment: string): ProceduralLane | null {
  const h = fragment.toLowerCase();
  const scores: Record<ProceduralLane, number> = {
    payment: countDistinctLaneCueHits(h, LANE_PAYMENT_CUES),
    appeal: countDistinctLaneCueHits(h, LANE_APPEAL_CUES),
    submission: countDistinctLaneCueHits(h, LANE_SUBMISSION_CUES),
    appointment: countDistinctLaneCueHits(h, LANE_APPOINTMENT_CUES),
  };
  let max = -1;
  for (const lane of LANE_ORDER) max = Math.max(max, scores[lane]);
  if (max <= 0) return null;
  for (const lane of LANE_ORDER) {
    if (scores[lane] === max) return lane;
  }
  return null;
}

function fragmentAroundGenerated(generated: string, idx: number, spanLen: number): string {
  const ctxStart = Math.max(0, idx - GENERATED_LANE_SCAN_RADIUS_CHARS);
  const ctxEnd = Math.min(generated.length, idx + spanLen + GENERATED_LANE_SCAN_RADIUS_CHARS);
  return generated.slice(ctxStart, ctxEnd);
}

function detectProceduralLaneAt(generated: string, dateStartIdx: number, dateLen: number): ProceduralLane | null {
  return detectProceduralLane(fragmentAroundGenerated(generated, dateStartIdx, dateLen));
}

function laneCuesFor(lane: ProceduralLane): readonly string[] {
  const map: Record<ProceduralLane, readonly string[]> = {
    payment: LANE_PAYMENT_CUES,
    appeal: LANE_APPEAL_CUES,
    submission: LANE_SUBMISSION_CUES,
    appointment: LANE_APPOINTMENT_CUES,
  };
  return map[lane];
}

function sourceSliceMatchesLane(slice: string, lane: ProceduralLane): boolean {
  const h = slice.toLowerCase();
  return laneCuesFor(lane).some((cue) => h.includes(cue.toLowerCase()));
}

function tokenOccurrenceMatchesLane(token: string, source: string, lane: ProceduralLane): boolean {
  let from = 0;
  while (from <= source.length) {
    const i = source.indexOf(token, from);
    if (i === -1) break;
    const start = Math.max(0, i - DEADLINE_CUE_WINDOW_CHARS);
    const end = Math.min(source.length, i + token.length + DEADLINE_CUE_WINDOW_CHARS);
    if (sourceSliceMatchesLane(source.slice(start, end), lane)) return true;
    from = i + 1;
  }
  return false;
}

function proceduralDateReplacementPhrase(locale: SmartTalkLocale | undefined): string {
  if (locale === "de") return "innerhalb der im Dokument genannten Frist";
  if (locale === "en") return "within the deadline stated in the document";
  return "v lehote uvedenej v dokumente";
}

function paymentLaneSafePhrase(locale: SmartTalkLocale | undefined): string {
  if (locale === "de") return "innerhalb der im Dokument genannten Zahlungsfrist";
  if (locale === "en") return "within the payment deadline stated in the document";
  return "v lehote uvedenej v dokumente";
}

function appealLaneSafePhrase(locale: SmartTalkLocale | undefined, source: string): string {
  const srcLower = source.toLowerCase();
  const hasRelativeMonthWindow =
    srcLower.includes("innerhalb eines monats") ||
    srcLower.includes("nach bekanntgabe") ||
    srcLower.includes("nach bekannmachung");

  if (locale === "de") {
    return hasRelativeMonthWindow
      ? "innerhalb eines Monats nach Bekanntgabe (wie im Dokument angegeben)"
      : "innerhalb der im Dokument genannten Frist";
  }
  if (locale === "en") {
    return hasRelativeMonthWindow
      ? "within one month of notification of the decision (as stated in the document)"
      : "within the deadline stated in the document";
  }
  return hasRelativeMonthWindow ? "do jedného mesiaca od doručenia rozhodnutia" : "v lehote uvedenej v poučení";
}

function laneMismatchConcreteDateReplacement(
  locale: SmartTalkLocale | undefined,
  source: string,
  lane: ProceduralLane | null,
): string {
  if (lane === "payment") return paymentLaneSafePhrase(locale);
  if (lane === "appeal") return appealLaneSafePhrase(locale, source);
  return proceduralDateReplacementPhrase(locale);
}

function concreteDateGroundingDecision(
  match: string,
  offset: number,
  fullGenerated: string,
  source: string,
): { keep: boolean; lane: ProceduralLane | null } {
  if (!source.includes(match)) return { keep: false, lane: null };
  const lane = detectProceduralLaneAt(fullGenerated, offset, match.length);
  if (lane !== null) {
    return {
      keep: tokenOccurrenceMatchesLane(match, source, lane),
      lane,
    };
  }
  return {
    keep: calendarTokensProceduralCueGroundedInSource(match, source),
    lane: null,
  };
}

function itemCalendarTokensGrounded(item: string, source: string): boolean {
  if (!source.trim()) return true;
  const pairs: Array<{ match: string; offset: number }> = [];
  const euRe = /\b\d{1,2}\.\d{1,2}\.\d{4}\b/g;
  let em: RegExpExecArray | null;
  while ((em = euRe.exec(item)) !== null) {
    pairs.push({ match: em[0], offset: em.index });
  }
  const isoRe = /\b\d{4}-\d{2}-\d{2}\b/g;
  while ((em = isoRe.exec(item)) !== null) {
    pairs.push({ match: em[0], offset: em.index });
  }
  return pairs.every(({ match, offset }) => concreteDateGroundingDecision(match, offset, item, source).keep);
}

/**
 * Model output passes if it has no calendar tokens, OR every DD.MM.YYYY / ISO date
 * in the item occurs in source near a procedural cue (7.8C).
 */
function calendarTokensProceduralCueGroundedInSource(item: string, source: string): boolean {
  const tokens = uniqueCalendarTokens(item);
  if (tokens.length === 0) return true;
  return tokens.every(
    (tok) => source.includes(tok) && dateTokenOccurrenceCueGroundedInSource(tok, source),
  );
}

function filterArrayByProceduralCalendarGrounding(items: string[], source: string): string[] {
  if (!source.trim()) return items;
  return items.filter((s) => itemCalendarTokensGrounded(s, source));
}

/**
 * Phase 7.8D + 7.9B/C: Replace concrete dates when cue-grounding or procedural lane isolation fails.
 */
function sanitizeProceduralDateProse(
  text: string,
  source: string,
  locale?: SmartTalkLocale,
): string {
  if (!text || !source.trim()) return text;

  const replaceMatch = (match: string, offset: number): string => {
    const { keep, lane } = concreteDateGroundingDecision(match, offset, text, source);
    if (keep) return match;
    return laneMismatchConcreteDateReplacement(locale, source, lane);
  };

  let accum = "";
  let last = 0;
  const euPass = /\b\d{1,2}\.\d{1,2}\.\d{4}\b/g;
  let em: RegExpExecArray | null;
  while ((em = euPass.exec(text)) !== null) {
    accum += text.slice(last, em.index);
    accum += replaceMatch(em[0], em.index);
    last = em.index + em[0].length;
  }
  accum += text.slice(last);
  text = accum;

  accum = "";
  last = 0;
  const isoPass = /\b\d{4}-\d{2}-\d{2}\b/g;
  while ((em = isoPass.exec(text)) !== null) {
    accum += text.slice(last, em.index);
    accum += replaceMatch(em[0], em.index);
    last = em.index + em[0].length;
  }
  accum += text.slice(last);
  return accum;
}

/** Strip Bekanntgabe-style relative appeal windows beside payment wording (Phase 7.9C). */
function sanitizeAppealRelativeLeakInPaymentLane(text: string, locale?: SmartTalkLocale): string {
  let out = text;
  let guard = 0;
  while (guard++ < 80) {
    let best: { idx: number; len: number } | null = null;
    for (const proto of APPEAL_RELATIVE_PHRASE_LEAK_PATTERNS) {
      const r = new RegExp(proto.source, proto.flags.includes("g") ? proto.flags : `${proto.flags}g`);
      const m = r.exec(out);
      if (!m) continue;
      const idx = m.index;
      const lane = detectProceduralLane(fragmentAroundGenerated(out, idx, m[0].length));
      if (lane !== "payment") continue;
      if (!best || idx < best.idx || (idx === best.idx && m[0].length > best.len)) {
        best = { idx, len: m[0].length };
      }
    }
    if (!best) break;
    const insert = paymentLaneSafePhrase(locale);
    out = out.slice(0, best.idx) + insert + out.slice(best.idx + best.len);
  }
  return out;
}

function sanitizeUserVisibleProceduralProse(text: string, source: string, locale?: SmartTalkLocale): string {
  let s = sanitizeProceduralDateProse(text, source, locale);
  s = sanitizeAppealRelativeLeakInPaymentLane(s, locale);
  s = sanitizeProceduralFabricationPatterns(s, source, locale);
  return s;
}

function sanitizeStringArrayFields(
  items: string[],
  source: string,
  locale?: SmartTalkLocale,
): string[] {
  const out: string[] = [];
  for (const item of items) {
    const s = sanitizeUserVisibleProceduralProse(item, source, locale).trim();
    if (s) out.push(s);
  }
  return out;
}

/** Phase 8.0B — question protocols: strip invented concrete calendar dates not verbatim in user text; no document-source sanitizers. */
function lightUnsupportedCalendarPhrase(locale?: SmartTalkLocale): string {
  if (locale === "de") return "Ein konkretes Datum nennen wir hier nicht — es hängt von Behörde und Einzelfall ab.";
  if (locale === "en") return "We do not state a specific calendar date here—it depends on the office and your situation.";
  return "Konkrétny kalendárny dátum tu neuvádzame — závisí od úradu a situácie.";
}

function lightSanitizeQuestionProse(text: string, source: string, locale?: SmartTalkLocale): string {
  if (!text) return text;
  let out = text;
  const euRe = /\b\d{1,2}\.\d{1,2}\.\d{4}\b/g;
  out = out.replace(euRe, (m) => (source.includes(m) ? m : lightUnsupportedCalendarPhrase(locale)));
  const isoRe = /\b\d{4}-\d{2}-\d{2}\b/g;
  out = out.replace(isoRe, (m) => (source.includes(m) ? m : lightUnsupportedCalendarPhrase(locale)));
  return out.replace(/\s{2,}/g, " ").trim();
}

function sanitizeStringArrayFieldsLight(
  items: string[],
  source: string,
  locale?: SmartTalkLocale,
): string[] {
  const out: string[] = [];
  for (const item of items) {
    const s = lightSanitizeQuestionProse(item, source, locale).trim();
    if (s) out.push(s);
  }
  return out;
}

function normalizeParsedObject(
  obj: Record<string, unknown>,
  groundSourceText?: string,
  locale?: SmartTalkLocale,
  protocol: SmartTalkReasoningProtocol = "strict_document",
): SmartTalkResult {
  const ground = typeof groundSourceText === "string" ? groundSourceText : "";

  const warningsRaw = parseStringArray(obj.warnings, 12, 400);
  const stabilizers: string[] = parseStringArray(obj.stabilizers, 2, 400);

  let summary = typeof obj.summary === "string" ? obj.summary.trim() : "";
  let meaning = typeof obj.meaning === "string" ? obj.meaning.trim() : "";

  if (!summary) summary = "Nepodarilo sa získať zhrnutie z výstupu modelu.";
  if (!meaning) meaning = "Ďalšie informácie nájdete v zhrnutí a upozorneniach.";

  let urgency: SmartTalkUrgency = "unknown";
  if (typeof obj.urgency === "string" && URGENCY_SET.has(obj.urgency)) {
    urgency = obj.urgency as SmartTalkUrgency;
  }

  let confidenceLevel: SmartTalkConfidenceLevel = DEFAULT_CONFIDENCE;
  if (
    typeof obj.confidenceLevel === "string" &&
    CONFIDENCE_SET.has(obj.confidenceLevel)
  ) {
    confidenceLevel = obj.confidenceLevel as SmartTalkConfidenceLevel;
  }

  let consequencePhase: SmartTalkConsequencePhase = DEFAULT_CONSEQUENCE;
  if (
    typeof obj.consequencePhase === "string" &&
    CONSEQUENCE_SET.has(obj.consequencePhase)
  ) {
    consequencePhase = obj.consequencePhase as SmartTalkConsequencePhase;
  }

  let documentQuality: SmartTalkDocumentQuality = DEFAULT_DOCUMENT_QUALITY;
  if (
    typeof obj.documentQuality === "string" &&
    DOCUMENT_QUALITY_SET.has(obj.documentQuality)
  ) {
    documentQuality = obj.documentQuality as SmartTalkDocumentQuality;
  }

  const nextStepsRaw = parseStringArray(obj.nextSteps, 16, 500);

  let documentKind: SmartTalkDocumentKind = "unknown";
  if (typeof obj.documentKind === "string" && DOCUMENT_KIND_SET.has(obj.documentKind)) {
    documentKind = obj.documentKind as SmartTalkDocumentKind;
  }

  let domain: SmartTalkDomain = "unknown";
  if (typeof obj.domain === "string" && DOMAIN_SET.has(obj.domain)) {
    domain = obj.domain as SmartTalkDomain;
  }

  const documentTypeLabel = normalizeDocumentTypeLabel(obj.documentTypeLabel);

  let paymentChannel: SmartTalkPaymentChannel = "not_applicable";
  if (typeof obj.paymentChannel === "string" && PAYMENT_CHANNEL_SET.has(obj.paymentChannel)) {
    paymentChannel = obj.paymentChannel as SmartTalkPaymentChannel;
  }

  let proceduralState: SmartTalkProceduralState = "unknown";
  if (
    typeof obj.proceduralState === "string" &&
    PROCEDURAL_STATE_SET.has(obj.proceduralState)
  ) {
    proceduralState = obj.proceduralState as SmartTalkProceduralState;
  }

  let legalSeverity: SmartTalkLegalSeverity = "none";
  if (typeof obj.legalSeverity === "string" && LEGAL_SEVERITY_SET.has(obj.legalSeverity)) {
    legalSeverity = obj.legalSeverity as SmartTalkLegalSeverity;
  }

  const deadlinesRaw = parseStringArray(obj.deadlines, 12, 400);
  const rightsRaw = parseStringArray(obj.rights, 10, 400);
  const obligationsRaw = parseStringArray(obj.obligations, 10, 400);
  const consequencesRaw = parseStringArray(obj.consequences, 10, 400);

  const strictDoc = protocol === "strict_document";

  const deadlinesFiltered = strictDoc
    ? filterArrayByProceduralCalendarGrounding(deadlinesRaw, ground)
    : deadlinesRaw;

  const sanitizeArrays = strictDoc ? sanitizeStringArrayFields : sanitizeStringArrayFieldsLight;
  const sanitizeVisibleProse = strictDoc ? sanitizeUserVisibleProceduralProse : lightSanitizeQuestionProse;

  const deadlines = sanitizeArrays(deadlinesFiltered, ground, locale);

  const warnings = sanitizeArrays(warningsRaw, ground, locale);
  const nextSteps = sanitizeArrays(nextStepsRaw, ground, locale);
  const rights = sanitizeArrays(rightsRaw, ground, locale);
  const obligations = sanitizeArrays(obligationsRaw, ground, locale);
  const consequences = sanitizeArrays(consequencesRaw, ground, locale);

  const stabilizersSanitized = sanitizeArrays(stabilizers, ground, locale).slice(0, 2);

  summary = sanitizeVisibleProse(summary, ground, locale).trim();
  if (!summary) summary = "Nepodarilo sa získať zhrnutie z výstupu modelu.";
  meaning = sanitizeVisibleProse(meaning, ground, locale).trim();
  if (!meaning) meaning = "Ďalšie informácie nájdete v zhrnutí a upozorneniach.";

  return {
    summary: summary.slice(0, 8000),
    meaning: meaning.slice(0, 12000),
    urgency,
    nextSteps,
    warnings,
    stabilizers: stabilizersSanitized,
    confidenceLevel,
    consequencePhase,
    documentQuality,
    documentKind,
    domain,
    documentTypeLabel,
    paymentChannel,
    proceduralState,
    legalSeverity,
    deadlines,
    rights,
    obligations,
    consequences,
  };
}

function fallbackInvalidJson(): SmartTalkResult {
  return {
    summary: "Nepodarilo sa spoľahlivo spracovať odpoveď AI.",
    meaning: "Skúste text odoslať znova alebo vložte kratšiu, jasnejšiu časť dokumentu.",
    urgency: "unknown",
    nextSteps: [
      "Skontrolujte, či ste vložili čitateľný úradný text.",
      "Ak problém pretrváva, skúste vložiť kratší úsek dokumentu.",
    ],
    warnings: [
      "Výsledok môže byť neúplný, pretože odpoveď AI nebola v očakávanom formáte.",
    ],
    stabilizers: DEFAULT_STABILIZERS,
    confidenceLevel: DEFAULT_CONFIDENCE,
    consequencePhase: DEFAULT_CONSEQUENCE,
    documentQuality: DEFAULT_DOCUMENT_QUALITY,
    documentKind: "unknown",
    domain: "unknown",
    documentTypeLabel: "",
    paymentChannel: "not_applicable",
    proceduralState: "unknown",
    legalSeverity: "none",
    deadlines: [],
    rights: [],
    obligations: [],
    consequences: [],
  };
}

export type RunSmartTalkError = { kind: "openai_http"; status: number } | { kind: "openai_empty" };

// [TD-002] post-model/pre-user-visible governance seam — disabled-by-default
// containment only | no user-visible output | no persistence | no production authorization
// TD-002 remains subject to post-wiring audit and closure decision
const EVIDENCE_GATES_SCOPED_DRY_RUN_CONTAINMENT_ENABLED = false;

// Non-exported local helper for the containment seam.
// Returns a synthetic contract-shaped governance input only.
// Must not use raw user input, raw model output, raw document text, OCR/photo text, real PII, or user-facing strings.
function _buildSyntheticGovernanceInputForContainmentSeam(): Parameters<typeof runEvidenceGatesRuntimeAdapterDryRun>[0] {
  return {
    sourceKind: "user_text_normalized",
    lane: "standard_text",
    normalizedTextOrModelOutput: "SYNTHETIC_GOVERNANCE_PROBE_8x7H_CONTAINMENT_SEAM",
    preModelSafetyStatus: "safe",
    piiRedactionStatus: "applied",
    evidenceCandidateMetadata: { hasStructuredEvidence: false },
    claimCandidateMetadata: {
      hasHighRiskClaim: false,
      hasDocumentDerivedClaim: false,
      claimAuthorizationStatus: "not_evaluated",
    },
    trapCandidateMetadata: { hasStructuredActiveTrap: false },
    riskContext: { hasKnownRiskSignals: false },
    authorizationContext: {
      userVisibleOutputExplicitlyAuthorized: false,
      realityAuthorizationStatus: "not_evaluated",
    },
  };
}

/**
 * Calls OpenAI with JSON object mode. Requires OPENAI_API_KEY in env.
 * On successful HTTP but unparseable JSON, returns a safe fallback result (no throw).
 * On HTTP failure or empty content, returns { ok: false, error }.
 */
export async function runSmartTalk(params: {
  text: string;
  locale: SmartTalkLocale;
  inputType: SmartTalkInputType;
  source?: SmartTalkTextSource;
}): Promise<{ ok: true; result: SmartTalkResult } | { ok: false; error: RunSmartTalkError }> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    return { ok: false, error: { kind: "openai_empty" } };
  }

  const model = process.env.OPENAI_SMART_TALK_MODEL?.trim() || DEFAULT_MODEL;
  const { system, user } = buildSmartTalkMessages(params);

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 55_000);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 2300,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return { ok: false, error: { kind: "openai_http", status: res.status } };
    }

    const body = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const rawContent = body.choices?.[0]?.message?.content;
    if (typeof rawContent !== "string" || !rawContent.trim()) {
      return { ok: false, error: { kind: "openai_empty" } };
    }

    const content = stripJsonFence(rawContent);
    let parsed: unknown;
    try {
      parsed = JSON.parse(content) as unknown;
    } catch {
      return { ok: true, result: fallbackInvalidJson() };
    }

    if (!parsed || typeof parsed !== "object") {
      return { ok: true, result: fallbackInvalidJson() };
    }

    const protocol = deriveSmartTalkReasoningProtocol(params);

    const _smartTalkResult = normalizeParsedObject(
      parsed as Record<string, unknown>,
      params.text,
      params.locale,
      protocol,
    );

    // [TD-002] post-model/pre-user-visible governance seam — disabled-by-default
    // containment only | no user-visible output | no persistence | no production authorization
    // TD-002 remains subject to post-wiring audit and closure decision
    if (EVIDENCE_GATES_SCOPED_DRY_RUN_CONTAINMENT_ENABLED) {
      // This branch is statically disabled (EVIDENCE_GATES_SCOPED_DRY_RUN_CONTAINMENT_ENABLED = false).
      // Adapter output is not surfaced to users, not persisted, and not returned to the caller.
      const _syntheticGovernanceInput = _buildSyntheticGovernanceInputForContainmentSeam();
      const _containmentAdapterOutput = runEvidenceGatesRuntimeAdapterDryRun(_syntheticGovernanceInput);
      void _containmentAdapterOutput;
    }

    return { ok: true, result: _smartTalkResult };
  } catch {
    return { ok: false, error: { kind: "openai_http", status: 0 } };
  } finally {
    clearTimeout(t);
  }
}
