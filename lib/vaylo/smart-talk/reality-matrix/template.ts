/**
 * UNIVERSAL_REALITY_MATRIX_TEMPLATE — reference architecture only (Phase 8.2B).
 *
 * Not loaded by Smart Talk at runtime. Safe placeholders + realistic skeleton rows.
 * TODO(8.2C): Evidence gates consume typed cues/rules.
 * TODO(8.2D): Reality simulation / regression corpus references this shape.
 */

import type {
  ClaimRule,
  EvidenceCue,
  EvidenceRule,
  HallucinationTrap,
  ProceduralLane,
  SeverityRule,
  StabilizerRule,
  UniversalDocumentRealityMatrix,
} from "./types";

const LANES_FULL: readonly ProceduralLane[] = [
  "payment",
  "appeal",
  "submission",
  "appointment",
  "informational",
];

const LANES_PAYMENT_INFO: readonly ProceduralLane[] = ["payment", "informational"];

/** Shared traps every payment-adjacent family should acknowledge in docs. */
const SHARED_PAYMENT_TRAPS: readonly HallucinationTrap[] = [
  {
    id: "trap_invoice_to_enforcement",
    kind: "invoice_to_enforcement",
    description: "Invoice / payment notice must not imply enforcement or execution.",
    dangerousInference:
      "Inferring Inkasso, Vollstreckung, Gerichtsvollzieher, or Betreibung from a routine Rechnung or Zahlungsavis alone.",
    blockedInterpretationBehavior:
      "Treat the document as establishing payment expectation only; do not assert enforcement paths unless separate explicit cues exist (not modeled on this matrix).",
    relatedClaimTypes: ["enforcement_risk"],
    relatedLanes: ["payment"],
  },
  {
    id: "trap_lane_contamination",
    kind: "lane_contamination",
    description: "Keep appeal-relative windows off payment-only surfaces.",
    dangerousInference:
      "Attaching Bekanntgabe-relative objection timing to pure payment-due lines or mixing unrelated calendar tokens across lanes.",
    blockedInterpretationBehavior:
      "Keep payment-lane and appeal-lane evidence disjoint; never commute dates between lanes without co-occurrence proof (future gate).",
    relatedLanes: ["payment", "appeal"],
  },
];

/**
 * Single template object: structure + minimal realistic examples.
 * Per-family matrices in future phases should `satisfies UniversalDocumentRealityMatrix`.
 */
export const UNIVERSAL_REALITY_MATRIX_TEMPLATE: UniversalDocumentRealityMatrix = {
  schemaVersion: "8.2b-template-v1",
  documentType: "generic_unknown",

  supportedRealities: [
    "invoice_issued",
    "payment_due",
    "informational_notice",
    "unknown",
  ],

  blockedRealities: [
    // Example: template marks appeal_window_exists blocked for generic_unknown until classified.
    "appeal_window_exists",
  ],

  evidenceCues: [
    {
      id: "cue_rechnung_heading",
      description: "German invoice / bill heading vocabulary.",
      keywords: ["Rechnung", "Gesamtbetrag", "Zahlbetrag"],
      ocrSensitive: true,
      laneOwnership: ["payment", "informational"],
    },
    {
      id: "cue_zahlbar_bis",
      description: "Payment due phrasing cluster.",
      keywords: ["zahlbar bis", "fällig am", "Zahlungsziel"],
      ocrSensitive: true,
      laneOwnership: ["payment"],
    },
    {
      id: "cue_einspruch_window",
      description: "Tax appeal relative window (Finanzamt context).",
      keywords: ["Einspruch", "innerhalb eines Monats", "Bekanntgabe"],
      ocrSensitive: true,
      laneOwnership: ["appeal"],
    },
    {
      id: "cue_mahnung_stage",
      description: "Reminder / dunning vocabulary.",
      keywords: ["Mahnung", "Mahngebühr", "Säumnis"],
      ocrSensitive: true,
      laneOwnership: ["payment", "informational"],
    },
  ] as const satisfies readonly EvidenceCue[],

  evidenceRules: [
    {
      id: "ev_payment_due_explicit",
      label: "Printed payment obligation with due phrasing",
      requiredCueIds: ["cue_zahlbar_bis"],
      optionalCueIds: ["cue_rechnung_heading"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["payment"],
    },
    {
      id: "ev_appeal_window_contextual",
      label: "Appeal window language present",
      requiredCueIds: ["cue_einspruch_window"],
      minimumEvidenceLevel: "contextual",
      allowedLanes: ["appeal"],
    },
  ] as const satisfies readonly EvidenceRule[],

  allowedClaims: [
    {
      claimType: "payment_required",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_payment_due_explicit"],
      minimumConfidence: "medium",
    },
    {
      claimType: "appeal_possible",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_appeal_window_contextual"],
      blockedBy: ["informational_only"],
      minimumConfidence: "low",
    },
    {
      claimType: "informational_only",
      allowed: true,
      requiredEvidenceRuleIds: [],
      minimumConfidence: "high",
    },
  ] as const satisfies readonly ClaimRule[],

  forbiddenClaims: [
    // Example policy: generic_unknown matrix forbids asserting enforcement without classification.
    "enforcement_risk",
  ],

  hallucinationTraps: [
    ...SHARED_PAYMENT_TRAPS,
    {
      id: "trap_appeal_deadline_synthesis",
      kind: "appeal_deadline_synthesis",
      description: "No synthetic calendar end dates from issue date + relative rule.",
      dangerousInference:
        "Computing a concrete Frist-end day from Ausstellungsdatum, letter date, or Steuerjahr when only relative wording exists.",
      blockedInterpretationBehavior:
        "Keep relative windows relative; omit or hedge concrete DD.MM.YYYY unless cue-grounded in source (future gate).",
      relatedClaimTypes: ["deadline_present", "appeal_possible"],
      relatedLanes: ["appeal"],
    },
    {
      id: "trap_semantic_drift",
      kind: "semantic_drift",
      description: "Preserve printed modality; do not harden hedged language.",
      dangerousInference:
        "Turning vorläufig, unter Vorbehalt, or informational Avis into definitive sanctions or final refusals.",
      blockedInterpretationBehavior:
        "Paraphrase with matching certainty; prefer informational_payment_notice / informational_only when cues are weak.",
      relatedLanes: ["informational"],
    },
  ] as const satisfies readonly HallucinationTrap[],

  stabilizers: [
    {
      id: "stabilizer_no_final_decision",
      triggerConditions: [
        "Text explicitly states no final decision or no enforcement yet.",
      ],
      allowedWordingExamples: [
        "List uvádza, že zatiaľ nie je finálne rozhodnutie.",
        "Der Bescheid besagt, dass noch keine Vollstreckung erfolgt.",
      ],
      forbiddenWordingExamples: [
        "Určite ste v bezpečí.",
        "Enforcement wird nicht stattfinden.",
      ],
    },
  ] as const satisfies readonly StabilizerRule[],

  severityRules: [
    {
      id: "sev_none_informational",
      when: "Only informational_notice reality with explicit or strongly_supported evidence.",
      minimumEvidenceLevel: "strongly_supported",
      realitiesThatMayTrigger: ["informational_notice"],
      severity: "none",
    },
    {
      id: "sev_low_payment_due",
      when: "payment_due with explicit due line; no Mahnung cues.",
      minimumEvidenceLevel: "explicit",
      realitiesThatMayTrigger: ["payment_due"],
      blockedWhenRealities: ["reminder_notice"],
      severity: "low",
    },
    {
      id: "sev_medium_reminder",
      when: "reminder_notice with explicit Mahnung / fee cues.",
      minimumEvidenceLevel: "explicit",
      realitiesThatMayTrigger: ["reminder_notice"],
      claimTypesThatMayTrigger: ["payment_overdue"],
      severity: "medium",
    },
  ] as const satisfies readonly SeverityRule[],

  proceduralLanes: LANES_FULL,
};

/**
 * Example slice: how a Mahnung-specific matrix might specialize lanes (reference only).
 * Not merged at runtime in 8.2B.
 */
export const EXAMPLE_MAHNUNG_LANES: readonly ProceduralLane[] = LANES_PAYMENT_INFO;

/**
 * Example slice: Steuerbescheid typically uses appeal + payment lanes.
 * Reference for future per-family files.
 */
export const EXAMPLE_STEUERBESCHEID_LANES: readonly ProceduralLane[] = [
  "payment",
  "appeal",
  "informational",
];
