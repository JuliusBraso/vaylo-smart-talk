/**
 * PHASE 8.12C — Smart Talk First Contact Presentation Mapper + Validator
 *
 * Pure, deterministic mapping from an already-governed `SmartTalkResult`
 * (produced by the existing, unmodified `runSmartTalk()`) into a small,
 * bounded First Contact presentation object — plus a final safety
 * validator that must pass before the route returns a response.
 *
 * Both functions are pure: no model call, no OCR, no DB/Storage/DNA
 * access, no environment mutation. Neither function invents facts that
 * are not already present in the governed `SmartTalkResult` — every
 * presentation field is either a bounded/truncated copy of an existing
 * governed field or a small fixed fallback string used only when the
 * governed result provides nothing safely mappable.
 *
 * FACTS FIRST, PRESENTATION SECOND: the original `SmartTalkResult` is
 * never mutated, discarded, or overridden by this module — callers must
 * continue to return the untouched `SmartTalkResult` alongside whatever
 * this module produces.
 */

import type { SmartTalkResult } from "../run-smart-talk";
import type { FirstContactMarket } from "./first-contact-runtime-gate";

export const FIRST_CONTACT_PRESENTATION_VERSION = "v1" as const;

// ── Bounding limits (conservative, documented; no unbounded arrays/strings) ─
export const FIRST_CONTACT_MAX_SITUATION_SUMMARY_LEN = 600;
export const FIRST_CONTACT_MAX_FIRST_STEP_ACTION_LEN = 240;
export const FIRST_CONTACT_MAX_PREPARATION_ITEMS = 6;
export const FIRST_CONTACT_MAX_PREPARATION_LABEL_LEN = 160;
export const FIRST_CONTACT_MAX_CAN_WAIT_ITEMS = 4;
export const FIRST_CONTACT_MAX_CAN_WAIT_ITEM_LEN = 200;
export const FIRST_CONTACT_MAX_HELP_BOUNDARY_REASON_LEN = 200;
export const FIRST_CONTACT_MAX_EVIDENCE_LIMITATIONS = 6;
export const FIRST_CONTACT_MAX_EVIDENCE_LIMITATION_LEN = 200;

export type FirstContactPreparationRequirement =
  | "likely_helpful"
  | "may_be_required"
  | "requires_verification";

const FIRST_CONTACT_PREPARATION_REQUIREMENT_SET = new Set<string>([
  "likely_helpful",
  "may_be_required",
  "requires_verification",
]);

export type FirstContactPreparationItem = {
  label: string;
  requirementLevel: FirstContactPreparationRequirement;
};

export type FirstContactFirstStepBoundary =
  | "orientation"
  | "verification"
  | "official_contact"
  | "professional_help"
  | "emergency_help";

const FIRST_CONTACT_FIRST_STEP_BOUNDARY_SET = new Set<string>([
  "orientation",
  "verification",
  "official_contact",
  "professional_help",
  "emergency_help",
]);

export type FirstContactFirstStep = {
  action: string;
  boundary: FirstContactFirstStepBoundary;
};

export type FirstContactHelpBoundaryLevel = "none" | "official" | "professional" | "emergency";

const FIRST_CONTACT_HELP_BOUNDARY_LEVEL_SET = new Set<string>([
  "none",
  "official",
  "professional",
  "emergency",
]);

export type FirstContactHelpBoundary = {
  level: FirstContactHelpBoundaryLevel;
  reason: string | null;
};

export type FirstContactPresentation = {
  presentationVersion: "v1";
  situationSummary: string;
  firstStep: FirstContactFirstStep;
  preparationItems: FirstContactPreparationItem[];
  canWait: string[] | null;
  helpBoundary: FirstContactHelpBoundary;
  evidenceLimitations: string[];
  trustLevel: "untrusted";
};

export type FirstContactPresentationContext = {
  market: FirstContactMarket;
};

function buildBaseEvidenceLimitations(market: FirstContactMarket): string[] {
  return [
    "No document, photo, or file was interpreted for this request.",
    `Market context is server-bounded to ${market} only.`,
    "Model output remains untrusted and has not been reviewed by a human or an authority.",
  ];
}

const LOW_CONFIDENCE_EVIDENCE_LIMITATION =
  "Input was too limited or ambiguous to give a confident, specific answer.";

const GENERIC_FALLBACK_FIRST_STEP_ACTION =
  "Check the exact requirements directly with the relevant office before doing anything else.";

function truncate(s: string, maxLen: number): string {
  const trimmed = s.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return trimmed.slice(0, maxLen).trim();
}

function deriveSituationSummary(result: SmartTalkResult): string | null {
  const source = result.summary.trim() || result.meaning.trim();
  if (!source) return null;
  return truncate(source, FIRST_CONTACT_MAX_SITUATION_SUMMARY_LEN);
}

function deriveFirstStepBoundary(result: SmartTalkResult): FirstContactFirstStepBoundary {
  if (result.legalSeverity === "critical") return "emergency_help";
  if (result.urgency === "high" || result.legalSeverity === "high") return "professional_help";
  if (result.urgency === "unknown") return "official_contact";
  if (result.urgency === "medium") return "verification";
  return "orientation";
}

function deriveFirstStep(result: SmartTalkResult): FirstContactFirstStep {
  const boundary = deriveFirstStepBoundary(result);
  const candidate = result.nextSteps.find((s) => s.trim().length > 0);
  const action = candidate ? truncate(candidate, FIRST_CONTACT_MAX_FIRST_STEP_ACTION_LEN) : GENERIC_FALLBACK_FIRST_STEP_ACTION;
  return { action, boundary };
}

function derivePreparationItems(result: SmartTalkResult): FirstContactPreparationItem[] {
  const items: FirstContactPreparationItem[] = [];

  // Skip the first nextSteps entry — it is already used as firstStep.action.
  const remainingNextSteps = result.nextSteps.slice(1);
  for (const step of remainingNextSteps) {
    if (items.length >= FIRST_CONTACT_MAX_PREPARATION_ITEMS) break;
    const label = truncate(step, FIRST_CONTACT_MAX_PREPARATION_LABEL_LEN);
    if (!label) continue;
    items.push({ label, requirementLevel: "likely_helpful" });
  }

  for (const obligation of result.obligations) {
    if (items.length >= FIRST_CONTACT_MAX_PREPARATION_ITEMS) break;
    const label = truncate(obligation, FIRST_CONTACT_MAX_PREPARATION_LABEL_LEN);
    if (!label) continue;
    // No document was analyzed in First Contact mode, so obligations found
    // in governed output (question-mode text) are never presented as
    // certain — always "requires_verification" here.
    items.push({ label, requirementLevel: "requires_verification" });
  }

  return items.slice(0, FIRST_CONTACT_MAX_PREPARATION_ITEMS);
}

function deriveCanWait(result: SmartTalkResult): string[] | null {
  // Mechanical suppression: never present "can wait" under high or unknown risk.
  if (result.urgency === "high" || result.urgency === "unknown") return null;
  const items = result.stabilizers
    .map((s) => truncate(s, FIRST_CONTACT_MAX_CAN_WAIT_ITEM_LEN))
    .filter((s) => s.length > 0)
    .slice(0, FIRST_CONTACT_MAX_CAN_WAIT_ITEMS);
  return items.length > 0 ? items : null;
}

function deriveHelpBoundary(result: SmartTalkResult): FirstContactHelpBoundary {
  let level: FirstContactHelpBoundaryLevel = "none";
  if (result.legalSeverity === "critical") {
    level = "emergency";
  } else if (result.urgency === "high" || result.legalSeverity === "high") {
    level = "professional";
  } else if (result.urgency === "unknown") {
    level = "official";
  }

  if (level === "none") return { level, reason: null };

  const firstWarning = result.warnings.find((w) => w.trim().length > 0);
  const reason = firstWarning
    ? truncate(firstWarning, FIRST_CONTACT_MAX_HELP_BOUNDARY_REASON_LEN)
    : truncate(
        "Risk level could not be classified with confidence from the available text.",
        FIRST_CONTACT_MAX_HELP_BOUNDARY_REASON_LEN,
      );
  return { level, reason };
}

function deriveEvidenceLimitations(result: SmartTalkResult, market: FirstContactMarket): string[] {
  const items = buildBaseEvidenceLimitations(market);
  if (result.confidenceLevel === "low") {
    items.push(LOW_CONFIDENCE_EVIDENCE_LIMITATION);
  }
  return items.slice(0, FIRST_CONTACT_MAX_EVIDENCE_LIMITATIONS);
}

/**
 * Builds a bounded First Contact presentation from an already-governed
 * `SmartTalkResult`. Returns `null` (fail closed) only when no safe
 * `situationSummary` can be derived at all — this module never fabricates
 * a summary that is not grounded in the governed `summary`/`meaning`
 * fields, and never makes a second model call to fill the gap.
 */
export function buildFirstContactPresentation(
  result: SmartTalkResult,
  context: FirstContactPresentationContext,
): FirstContactPresentation | null {
  const situationSummary = deriveSituationSummary(result);
  if (!situationSummary) return null;

  return {
    presentationVersion: FIRST_CONTACT_PRESENTATION_VERSION,
    situationSummary,
    firstStep: deriveFirstStep(result),
    preparationItems: derivePreparationItems(result),
    canWait: deriveCanWait(result),
    helpBoundary: deriveHelpBoundary(result),
    evidenceLimitations: deriveEvidenceLimitations(result, context.market),
    trustLevel: "untrusted",
  };
}

// ── Final safety validator ──────────────────────────────────────────────────

/**
 * Narrow, high-precision phrase checks used only as a defense-in-depth
 * safety net. Deliberately NOT broad single-word regexes (e.g. matching
 * any mention of "pay" or "zaplatiť") — those would false-positive on
 * ordinary governed orientation text that merely *describes* a payment
 * or filing concept without instructing/claiming completion of it.
 */
const FORBIDDEN_PHRASE_PATTERNS: ReadonlyArray<{ pattern: RegExp; violation: string }> = [
  {
    pattern: /zapla[ťt]te (teraz|ihne[ďd])|pay (now|immediately)|uhra[ďd]te (t[uú]to|dan[uú]) [čc]iastku/iu,
    violation: "payment instruction",
  },
  {
    pattern: /poda[jť]te (žiadosť|ziadost|formul[aá]r) (teraz|ihne[ďd])|submit the (application|form) now|file (the )?application now/iu,
    violation: "filing instruction",
  },
  {
    pattern: /podp[íi][šs]te (tento|ten) formul[aá]r|sign (this|the) (form|document) now/iu,
    violation: "signing instruction",
  },
  {
    pattern: /vzdajte sa (svojho )?pr[aá]va|waive your right/iu,
    violation: "rights-waiver instruction",
  },
  {
    pattern: /je (to )?overen[eé]|bolo schv[aá]len[eé]|has been (verified|approved)|is officially confirmed/iu,
    violation: "verified/approved claim",
  },
  {
    pattern: /žiadosť (bola|už) podan[aá]|ziadost (bola|uz) podana|proces (je )?ukon[čc]en[yý]|application (has been|was) submitted|process (is )?complete/iu,
    violation: "process-complete/application-submitted claim",
  },
  {
    pattern: /analyzovali (sme )?(v[aá][šs]|va[šs]u )?dokument|we analyzed your document|dokument bol (d[oô]kladne )?preskúman[yý]/iu,
    violation: "document-analyzed-without-content claim",
  },
  {
    pattern: /ulo[žz]ili sme|we (have )?(saved|stored) your|dna (bola )?(aktualizovan[aá]|ulo[žz]en[aá])/iu,
    violation: "persistence/DNA claim",
  },
  {
    pattern: /rak[uú]sk[eo]|austria|jurisdikcia je (potvrden[aá]|overen[aá])/iu,
    violation: "unsupported authority/jurisdiction certainty",
  },
];

const REASSURANCE_UNDER_RISK_PATTERNS: readonly RegExp[] = [
  /nie je to nal[iíi]hav[eé]|no need to worry|is not urgent|can (be )?safely (be )?delayed|nemus[íi]te sa (ponáhľať|obávať)/iu,
];

function collectPresentationTextFields(p: FirstContactPresentation): string[] {
  return [
    p.situationSummary,
    p.firstStep.action,
    ...p.preparationItems.map((i) => i.label),
    ...(p.canWait ?? []),
    p.helpBoundary.reason ?? "",
    ...p.evidenceLimitations,
  ];
}

export type FirstContactValidationResult = {
  valid: boolean;
  violations: string[];
};

/**
 * Final, bounded, structural safety validator. Must pass before a route
 * ever returns a First Contact presentation to a caller. Rejects on any
 * violation rather than silently weakening the presentation.
 */
export function validateFirstContactPresentation(
  original: SmartTalkResult,
  presentation: FirstContactPresentation,
): FirstContactValidationResult {
  const violations: string[] = [];

  if (presentation.trustLevel !== "untrusted") {
    violations.push("trustLevel must be exactly \"untrusted\"");
  }
  if (presentation.presentationVersion !== FIRST_CONTACT_PRESENTATION_VERSION) {
    violations.push("presentationVersion must be exactly \"v1\"");
  }

  if (
    presentation.situationSummary.trim().length === 0 ||
    presentation.situationSummary.length > FIRST_CONTACT_MAX_SITUATION_SUMMARY_LEN
  ) {
    violations.push("situationSummary is empty or exceeds the bounded maximum length");
  }

  if (
    presentation.firstStep.action.trim().length === 0 ||
    presentation.firstStep.action.length > FIRST_CONTACT_MAX_FIRST_STEP_ACTION_LEN
  ) {
    violations.push("firstStep.action is empty or exceeds the bounded maximum length");
  }
  if (!FIRST_CONTACT_FIRST_STEP_BOUNDARY_SET.has(presentation.firstStep.boundary)) {
    violations.push("firstStep.boundary is not a recognized bounded value");
  }

  if (presentation.preparationItems.length > FIRST_CONTACT_MAX_PREPARATION_ITEMS) {
    violations.push("preparationItems exceeds the bounded maximum count");
  }
  for (const item of presentation.preparationItems) {
    if (item.label.trim().length === 0 || item.label.length > FIRST_CONTACT_MAX_PREPARATION_LABEL_LEN) {
      violations.push("a preparationItems label is empty or exceeds the bounded maximum length");
    }
    if (!FIRST_CONTACT_PREPARATION_REQUIREMENT_SET.has(item.requirementLevel)) {
      violations.push("a preparationItems requirementLevel is not a recognized bounded value");
    }
  }

  const highOrUnknownRisk = original.urgency === "high" || original.urgency === "unknown";
  if (presentation.canWait !== null) {
    if (highOrUnknownRisk) {
      violations.push("canWait must be null when urgency is high or unknown");
    }
    if (presentation.canWait.length > FIRST_CONTACT_MAX_CAN_WAIT_ITEMS) {
      violations.push("canWait exceeds the bounded maximum count");
    }
    for (const item of presentation.canWait) {
      if (item.trim().length === 0 || item.length > FIRST_CONTACT_MAX_CAN_WAIT_ITEM_LEN) {
        violations.push("a canWait item is empty or exceeds the bounded maximum length");
      }
    }
  }

  if (!FIRST_CONTACT_HELP_BOUNDARY_LEVEL_SET.has(presentation.helpBoundary.level)) {
    violations.push("helpBoundary.level is not a recognized bounded value");
  }
  if (
    presentation.helpBoundary.reason !== null &&
    presentation.helpBoundary.reason.length > FIRST_CONTACT_MAX_HELP_BOUNDARY_REASON_LEN
  ) {
    violations.push("helpBoundary.reason exceeds the bounded maximum length");
  }
  if (highOrUnknownRisk && presentation.helpBoundary.level === "none") {
    violations.push("helpBoundary.level must not be \"none\" when urgency is high or unknown");
  }

  if (
    presentation.evidenceLimitations.length === 0 ||
    presentation.evidenceLimitations.length > FIRST_CONTACT_MAX_EVIDENCE_LIMITATIONS
  ) {
    violations.push("evidenceLimitations must be non-empty and within the bounded maximum count");
  }
  for (const item of presentation.evidenceLimitations) {
    if (item.trim().length === 0 || item.length > FIRST_CONTACT_MAX_EVIDENCE_LIMITATION_LEN) {
      violations.push("an evidenceLimitations item is empty or exceeds the bounded maximum length");
    }
  }

  const textFields = collectPresentationTextFields(presentation);
  for (const field of textFields) {
    for (const { pattern, violation } of FORBIDDEN_PHRASE_PATTERNS) {
      if (pattern.test(field)) {
        violations.push(violation);
      }
    }
  }

  if (highOrUnknownRisk) {
    for (const field of textFields) {
      for (const pattern of REASSURANCE_UNDER_RISK_PATTERNS) {
        if (pattern.test(field)) {
          violations.push("urgency may not be downgraded via reassurance wording");
        }
      }
    }
  }

  return { valid: violations.length === 0, violations };
}
