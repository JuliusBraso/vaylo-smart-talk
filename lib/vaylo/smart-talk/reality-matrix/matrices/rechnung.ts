/**
 * Rechnung / Zahlungsavis / Beitragsrechnung / Lastschriftavis — first production-shaped matrix (Phase 8.2B-1).
 * Declarative only: no matching, no gates, no LLM integration.
 */

import type { UniversalDocumentRealityMatrix } from "../types";

/**
 * First real document matrix: validates UniversalDocumentRealityMatrix for a low-risk,
 * high-volume German billing / payment-notice surface.
 */
export const RECHNUNG_REALITY_MATRIX = {
  schemaVersion: "8.2b-1-rechnung-v1",
  documentType: "rechnung_payment_notice",

  supportedRealities: [
    "invoice_issued",
    "payment_due",
    "payment_scheduled",
    "direct_debit_scheduled",
    "informational_payment_notice",
    "recurring_contribution_notice",
    "unknown",
  ],

  blockedRealities: [
    "enforcement_active",
    "court_proceeding",
    "criminal_investigation",
    "immigration_risk",
    "benefit_suspension",
    "active_sanction",
    "tax_decision_issued",
    "appeal_window_exists",
  ],

  evidenceCues: [
    {
      id: "cue_rgn_zahlbar_faellig",
      description:
        "Printed payment obligation / due surface. OCR: watch for broken umlauts (fällig/fallig), merged lines.",
      keywords: ["zahlbar", "Zahlbar bis", "fällig", "fällig am", "Fälligkeit", "Zahlungsziel", "zu zahlen"],
      regexPatterns: ["\\bZahlbar\\s+bis\\b", "\\bfällig\\s+am\\b"],
      ocrSensitive: true,
      laneOwnership: ["payment"],
    },
    {
      id: "cue_rgn_bitte_zahlen",
      description: "Direct pay instruction cluster (Überweisung context).",
      keywords: ["Bitte zahlen", "bitte überweisen", "Zahlbetrag", "Gesamtbetrag", "Betrag EUR", "Rechnungsnummer"],
      ocrSensitive: true,
      laneOwnership: ["payment"],
    },
    {
      id: "cue_rgn_sepa_lastschrift",
      description: "SEPA / direct-debit vocabulary; do not conflate with manual transfer-only lines.",
      keywords: [
        "Lastschrift",
        "SEPA",
        "Mandat",
        "Mandatsreferenz",
        "wird abgebucht",
        "Einzug",
        "Gläubiger-ID",
        "Creditor Identifier",
      ],
      regexPatterns: ["\\bLastschrift\\b", "\\bMandatsreferenz\\b"],
      ocrSensitive: true,
      laneOwnership: ["payment"],
    },
    {
      id: "cue_rgn_manual_transfer",
      description: "Manual bank transfer cues (IBAN / Überweisung without SEPA-debit mandate language).",
      keywords: ["Überweisung", "IBAN", "BIC", "auf folgendes Konto", "Zahlung per Überweisung"],
      regexPatterns: ["\\bIBAN\\b"],
      ocrSensitive: true,
      laneOwnership: ["payment"],
    },
    {
      id: "cue_rgn_informational_surface",
      description:
        "Informational contribution / tariff / avis wording without mandatory payment command on same surface.",
      keywords: [
        "zu Ihrer Information",
        "Beitragsanpassung",
        "Avis",
        "Mitteilung",
        "Beitragsrechnung",
        "informieren wir",
      ],
      ocrSensitive: true,
      laneOwnership: ["informational"],
    },
    {
      id: "cue_rgn_recurring_contribution",
      description: "Recurring insurance / social contribution framing (not a one-off arbitrary invoice).",
      keywords: ["Beitrag", "monatlich", "Beitragszeitraum", "Krankenversicherung", "GKV", "PKV"],
      ocrSensitive: true,
      laneOwnership: ["payment", "informational"],
    },
    {
      id: "cue_rgn_overdue_or_dunning_stage",
      description:
        "Overdue / staged dunning vocabulary. For this matrix, treat as contextual—plain Rechnung should not jump to Mahnung narrative.",
      keywords: ["überfällig", "Mahnstufe", "Mahngebühr", "Säumnis", "nach Ablauf"],
      ocrSensitive: true,
      laneOwnership: ["payment", "informational"],
    },
    {
      id: "cue_rgn_utility_or_service_invoice",
      description: "Utility / telecom style billing (still payment lane; not immigration or benefits).",
      keywords: ["Abschlag", "Verbrauch", "Zählerstand", "Leistungszeitraum", "Strom", "Gas", "Wasser"],
      ocrSensitive: true,
      laneOwnership: ["payment", "informational"],
    },
  ],

  evidenceRules: [
    {
      id: "ev_rgn_payment_required",
      label:
        "Mandatory payment surface: Zahlbar/Fälligkeit line OR strong pay instruction (future gate: disjunctive — either required path sufficient, not both).",
      requiredCueIds: ["cue_rgn_zahlbar_faellig"],
      optionalCueIds: ["cue_rgn_bitte_zahlen"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["payment"],
    },
    {
      id: "ev_rgn_payment_required_alt",
      label: "Alternate path when Zahlbar line missing in OCR but pay instruction + amount cluster is clear.",
      requiredCueIds: ["cue_rgn_bitte_zahlen"],
      optionalCueIds: ["cue_rgn_zahlbar_faellig"],
      minimumEvidenceLevel: "strongly_supported",
      allowedLanes: ["payment"],
    },
    {
      id: "ev_rgn_payment_method_sepa",
      label: "SEPA / Lastschrift mandate or debit notice wording present.",
      requiredCueIds: ["cue_rgn_sepa_lastschrift"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["payment"],
    },
    {
      id: "ev_rgn_payment_method_manual",
      label: "Manual transfer instructions (IBAN/Überweisung) without exclusive SEPA-debit claim.",
      requiredCueIds: ["cue_rgn_manual_transfer"],
      optionalCueIds: ["cue_rgn_sepa_lastschrift"],
      minimumEvidenceLevel: "strongly_supported",
      allowedLanes: ["payment"],
    },
    {
      id: "ev_rgn_informational_only",
      label: "Informational payment-related notice without asserting a hard pay-by command from this matrix alone.",
      requiredCueIds: ["cue_rgn_informational_surface"],
      optionalCueIds: ["cue_rgn_recurring_contribution"],
      minimumEvidenceLevel: "contextual",
      allowedLanes: ["informational"],
    },
    {
      id: "ev_rgn_payment_overdue",
      label: "Overdue / late-payment language (downgrade to contextual if OCR noisy).",
      requiredCueIds: ["cue_rgn_overdue_or_dunning_stage"],
      optionalCueIds: ["cue_rgn_zahlbar_faellig"],
      minimumEvidenceLevel: "contextual",
      allowedLanes: ["payment", "informational"],
    },
    {
      id: "ev_rgn_deadline_present",
      label: "Calendar or relative deadline tied to payment (same-lane proximity enforced in future gate).",
      requiredCueIds: ["cue_rgn_zahlbar_faellig"],
      optionalCueIds: ["cue_rgn_bitte_zahlen"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["payment"],
    },
  ],

  allowedClaims: [
    {
      claimType: "payment_required",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_rgn_payment_required"],
      blockedBy: ["informational_only"],
      minimumConfidence: "medium",
    },
    {
      claimType: "payment_required",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_rgn_payment_required_alt"],
      blockedBy: ["informational_only"],
      minimumConfidence: "medium",
    },
    {
      claimType: "payment_method_sepa",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_rgn_payment_method_sepa"],
      minimumConfidence: "medium",
    },
    {
      claimType: "payment_method_manual",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_rgn_payment_method_manual"],
      minimumConfidence: "medium",
    },
    {
      claimType: "informational_only",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_rgn_informational_only"],
      minimumConfidence: "low",
    },
    {
      claimType: "payment_overdue",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_rgn_payment_overdue"],
      minimumConfidence: "low",
    },
    {
      claimType: "deadline_present",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_rgn_deadline_present"],
      minimumConfidence: "medium",
    },
  ],

  forbiddenClaims: [
    "enforcement_risk",
    "benefit_risk",
    "insurance_risk",
    "appeal_possible",
    "appointment_required",
    "documents_required",
  ],

  hallucinationTraps: [
    {
      id: "trap_rgn_invoice_to_enforcement",
      kind: "invoice_to_enforcement",
      description: "Rechnung / Zahlungsavis must not be read as enforcement or court debt action.",
      dangerousInference:
        "User-facing text that asserts Vollstreckung, Gerichtsvollzieher, Pfändung, or criminal consequences from a routine billing surface.",
      blockedInterpretationBehavior:
        "Do not assert enforcement_active or enforcement_risk; keep procedural severity in none/low unless Mahnung/Inkasso-class evidence exists outside this matrix.",
      relatedClaimTypes: ["enforcement_risk"],
      relatedLanes: ["payment"],
    },
    {
      id: "trap_rgn_lastschrift_to_manual",
      kind: "lastschrift_to_manual_payment",
      description: "Do not instruct manual transfer when SEPA debit is the stated collection method.",
      dangerousInference:
        "Telling the user to wire the amount when the letter states Abbuchung / Lastschrift / Mandat and no IBAN-pay instruction dominates.",
      blockedInterpretationBehavior:
        "Prefer payment_method_sepa narrative; if ambiguous, hedge and name both possibilities without prescribing a method not supported by text.",
      relatedClaimTypes: ["payment_method_manual", "payment_method_sepa"],
      relatedLanes: ["payment"],
    },
    {
      id: "trap_rgn_informational_to_threat",
      kind: "informational_notice_to_threat",
      description: "Informational Avis / Mitteilung must not be escalated to legal threat language.",
      dangerousInference:
        "Describing a tariff or contribution information letter as Mahnung, Inkasso, or imminent sanction.",
      blockedInterpretationBehavior:
        "Classify toward informational_payment_notice / informational_only; avoid reminder_notice realities on this matrix.",
      relatedClaimTypes: ["payment_overdue"],
      relatedLanes: ["informational"],
    },
    {
      id: "trap_rgn_insurance_to_claim_event",
      kind: "insurance_notice_to_claim_event",
      description: "Insurance contribution bill is not a coverage denial or Leistungsbescheid.",
      dangerousInference:
        "Inferring benefit cut, coverage end, or claim denial from a premium / Beitrag invoice alone.",
      blockedInterpretationBehavior:
        "Do not assert insurance_risk or benefit_suspension; describe as billing / contribution unless separate decision language exists.",
      relatedClaimTypes: ["insurance_risk", "benefit_risk"],
      relatedLanes: ["informational", "payment"],
    },
    {
      id: "trap_rgn_due_date_to_penalty",
      kind: "generic_due_date_to_penalty",
      description: "A printed due date is not automatically a Mahnstufe or fee ladder.",
      dangerousInference:
        "Inventing Mahngebühren, Säumniszuschlag stages, or default penalties not printed on this document family.",
      blockedInterpretationBehavior:
        "State only fees or stages explicitly named; otherwise keep consequences empty or hedged at contextual evidence level.",
      relatedClaimTypes: ["payment_overdue"],
      relatedLanes: ["payment"],
    },
    {
      id: "trap_rgn_lane_contamination",
      kind: "lane_contamination",
      description: "Payment dates and informational paragraphs must not swap roles under OCR.",
      dangerousInference:
        "Using a Kontoauszug date, service period header, or unrelated ISO token as the authoritative Zahlfrist.",
      blockedInterpretationBehavior:
        "Future gate: proximity + lane match required before binding a calendar token to payment_required or deadline_present.",
      relatedClaimTypes: ["deadline_present", "payment_required"],
      relatedLanes: ["payment", "informational"],
    },
  ],

  stabilizers: [
    {
      id: "stab_rgn_no_enforcement_mentioned",
      triggerConditions: [
        "Letter is billing-oriented and does not name Vollstreckung, Gerichtsvollzieher, or Inkasso.",
      ],
      allowedWordingExamples: [
        "Dokument zatiaľ nespomína vymáhanie.",
        "Platba môže byť plánovaná automaticky cez SEPA inkaso.",
        "List pôsobí skôr ako platobné oznámenie než právna výzva.",
      ],
      forbiddenWordingExamples: [
        "Určite nehrozí žiadny postih.",
        "Nemusíte nič platiť.",
        "Ste v plnom bezpečí pred úradom.",
      ],
    },
    {
      id: "stab_rgn_sepa_planned",
      triggerConditions: ["Explicit Lastschrift / Abbuchung / Mandat wording present."],
      allowedWordingExamples: [
        "O splátku môže účtovníctvo požiadať banku automaticky podľa údajov v liste (SEPA).",
      ],
      forbiddenWordingExamples: [
        "Banka už stiahla peniaze.",
        "Mandát je neplatný.",
      ],
    },
  ],

  severityRules: [
    {
      id: "sev_rgn_none_informational",
      when: "informational_payment_notice or informational-only cues dominate; no mandatory pay command.",
      minimumEvidenceLevel: "contextual",
      realitiesThatMayTrigger: ["informational_payment_notice"],
      severity: "none",
    },
    {
      id: "sev_rgn_low_invoice",
      when: "invoice_issued or payment_due with explicit payment surface; no overdue vocabulary.",
      minimumEvidenceLevel: "explicit",
      realitiesThatMayTrigger: ["invoice_issued", "payment_due", "payment_scheduled"],
      blockedWhenRealities: ["enforcement_active"],
      severity: "low",
    },
    {
      id: "sev_rgn_low_sepa",
      when: "direct_debit_scheduled with SEPA evidence rule satisfied.",
      minimumEvidenceLevel: "explicit",
      realitiesThatMayTrigger: ["direct_debit_scheduled"],
      severity: "low",
    },
    {
      id: "sev_rgn_medium_overdue_language",
      when: "payment_overdue claim path could apply—printed overdue / fee wording (still not enforcement).",
      minimumEvidenceLevel: "contextual",
      claimTypesThatMayTrigger: ["payment_overdue"],
      blockedWhenRealities: ["enforcement_active"],
      severity: "medium",
    },
  ],

  proceduralLanes: ["payment", "informational"],
} as const satisfies UniversalDocumentRealityMatrix;
