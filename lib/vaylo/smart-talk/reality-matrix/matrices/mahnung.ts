/**
 * Mahnung / Zahlungserinnerung / dunning ladder — third production-shaped matrix (Phase 8.2B-3).
 * Declarative only: no evaluators, no panic UX, no debt dramatization.
 *
 * Models escalation cognition conservatively — not Steuerberatung, not legal representation.
 */

import type { UniversalDocumentRealityMatrix } from "../types";

export const MAHNUNG_REALITY_MATRIX = {
  schemaVersion: "8.2b-3-mahnung-v1",
  documentType: "mahnung",

  supportedRealities: [
    "reminder_notice",
    "overdue_payment_notice",
    "repeated_payment_request",
    "payment_deadline_present",
    "payment_followup_notice",
    "possible_late_fee_notice",
    "escalation_warning_present",
    "final_reminder_notice",
    "payment_due",
    "unknown",
  ],

  blockedRealities: [
    "enforcement_active",
    "court_proceeding",
    "criminal_investigation",
    "immigration_risk",
    "benefit_suspension",
    "jobcenter_sanction",
    "account_seizure",
    "automatic_salary_garnishment",
    "active_inkasso_case",
    "eviction_risk",
    "health_insurance_termination",
    "tax_decision_issued",
    "appeal_window_exists",
    "active_sanction",
    "final_unappealable_decision",
  ],

  evidenceCues: [
    {
      id: "cue_mah_mahnung_heading",
      description: "Dunning / reminder document type. OCR: Mahnung vs Mahnunq; merged heading lines.",
      keywords: ["Mahnung", "Zahlungserinnerung", "erste Mahnung", "zweite Mahnung", "letzte Mahnung"],
      regexPatterns: ["\\bMahnung\\b", "\\bZahlungserinnerung\\b"],
      ocrSensitive: true,
      laneOwnership: ["payment", "escalation"],
    },
    {
      id: "cue_mah_offene_forderung",
      description: "Open claim / invoice reference — payment lane.",
      keywords: ["offene Rechnung", "offene Forderung", "Restforderung", "offener Betrag", "Rechnungsnummer"],
      ocrSensitive: true,
      laneOwnership: ["payment"],
    },
    {
      id: "cue_mah_bitte_zahlen",
      description: "Pay instruction cluster — payment lane.",
      keywords: ["bitte zahlen", "bitten wir um Zahlung", "Zahlung erbitten", "begleichen Sie", "ausgleichen"],
      ocrSensitive: true,
      laneOwnership: ["payment"],
    },
    {
      id: "cue_mah_restbetrag_faellig",
      description: "Balance and due / overdue surface — payment lane.",
      keywords: ["Restbetrag", "fällig", "fällig am", "überfällig", "Zahlungsfrist", "zahlbar bis", "Zahlbetrag"],
      ocrSensitive: true,
      laneOwnership: ["payment"],
    },
    {
      id: "cue_mah_mahngebuehr_saeumnis",
      description: "Late fee / dunning fee vocabulary — escalation lane (fee ≠ catastrophe).",
      keywords: ["Mahngebühr", "Mahngebuehr", "Säumniszuschlag", "Saeumniszuschlag", "Manipulationssicherheitsmerkmal"],
      ocrSensitive: true,
      laneOwnership: ["escalation", "payment"],
    },
    {
      id: "cue_mah_weitere_schritte",
      description:
        "Ambiguous escalation boilerplate — escalation lane; MUST NOT alone authorize Vollstreckung (see traps).",
      keywords: ["weitere Schritte", "weitere rechtliche Schritte", "Konsequenzen", "Androhung"],
      ocrSensitive: true,
      laneOwnership: ["escalation"],
    },
    {
      id: "cue_mah_letzte_mahnung",
      description: "Final reminder stage — escalation + payment; still not automatic enforcement.",
      keywords: ["letzte Mahnung", "letzte Zahlungsaufforderung"],
      ocrSensitive: true,
      laneOwnership: ["escalation", "payment"],
    },
    {
      id: "cue_mah_vollstreckung_explicit",
      description: "EXPLICIT enforcement wording — escalation lane only; gate must require verbatim-class hit.",
      keywords: ["Vollstreckung", "vollstrecken", "Zwangsvollstreckung", "Vollstreckungsmaßnahmen"],
      regexPatterns: ["\\bVollstreckung\\b"],
      ocrSensitive: true,
      laneOwnership: ["escalation"],
    },
    {
      id: "cue_mah_gerichtsvollzieher_explicit",
      description: "EXPLICIT bailiff / Gerichtsvollzieher — escalation lane.",
      keywords: ["Gerichtsvollzieher", "GVollstreckung", "Zwangsvollstreckungsbeamter"],
      ocrSensitive: true,
      laneOwnership: ["escalation"],
    },
    {
      id: "cue_mah_inkasso_explicit",
      description:
        "EXPLICIT Inkasso / third-party collection assignment (not generic 'Inkasso' rumor). OCR-sensitive.",
      keywords: ["Inkasso", "Inkassounternehmen", "Inkassoverfahren", "an Inkasso übergeben", "Forderungsinkasso"],
      regexPatterns: ["\\bInkassounternehmen\\b", "\\bInkassoverfahren\\b"],
      ocrSensitive: true,
      laneOwnership: ["escalation"],
    },
    {
      id: "cue_mah_bank_ueberweisung",
      description: "Payment channel hints — payment lane.",
      keywords: ["Überweisung", "IBAN", "BIC", "Bankverbindung", "Lastschrift", "SEPA"],
      ocrSensitive: true,
      laneOwnership: ["payment"],
    },
    {
      id: "cue_mah_clarification_bezahlt",
      description: "Already-paid / timing mismatch clarification — clarification lane.",
      keywords: [
        "falls Sie bereits gezahlt haben",
        "bereits beglichen",
        "Zahlung ist bereits eingegangen",
        "bei Zahlung nach Ausstellung",
      ],
      ocrSensitive: true,
      laneOwnership: ["clarification"],
    },
    {
      id: "cue_mah_clarification_kontakt",
      description: "Contact / dispute / error correction — clarification lane.",
      keywords: ["kontaktieren Sie uns", "Rückfragen", "Missverständnis", "Klärung", "Fehlerkorrektur", "Widerspruch"],
      ocrSensitive: true,
      laneOwnership: ["clarification", "appeal"],
    },
    {
      id: "cue_mah_datenschutz_hinweis",
      description: "Boilerplate — informational lane only.",
      keywords: ["Datenschutz", "allgemeine Hinweise", "Kontaktdaten", "Service"],
      ocrSensitive: false,
      laneOwnership: ["informational"],
    },
  ],

  evidenceRules: [
    {
      id: "ev_mah_payment_overdue",
      label: "Overdue / Mahnung surface: reminder heading plus overdue or open-claim language.",
      requiredCueIds: ["cue_mah_mahnung_heading"],
      optionalCueIds: ["cue_mah_restbetrag_faellig", "cue_mah_offene_forderung"],
      minimumEvidenceLevel: "strongly_supported",
      allowedLanes: ["payment", "escalation"],
    },
    {
      id: "ev_mah_payment_required",
      label: "Concrete payment demand with amount / rest / pay-by cluster.",
      requiredCueIds: ["cue_mah_bitte_zahlen"],
      optionalCueIds: ["cue_mah_restbetrag_faellig", "cue_mah_offene_forderung", "cue_mah_bank_ueberweisung"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["payment"],
    },
    {
      id: "ev_mah_payment_required_alt",
      label: "Alternate path: strong Restbetrag/fällig cluster with Mahnung heading (OCR dropped Bitte zahlen line).",
      requiredCueIds: ["cue_mah_mahnung_heading", "cue_mah_restbetrag_faellig"],
      optionalCueIds: ["cue_mah_offene_forderung"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["payment"],
    },
    {
      id: "ev_mah_late_fee_possible",
      label: "Mahngebühr / Säumniszuschlag — fee risk, not criminal or seizure.",
      requiredCueIds: ["cue_mah_mahngebuehr_saeumnis"],
      optionalCueIds: ["cue_mah_mahnung_heading"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["escalation", "payment"],
    },
    {
      id: "ev_mah_escalation_warning_present",
      label:
        "weitere Schritte / Androhung — contextual warning only; does NOT satisfy enforcement_risk (see separate explicit rules).",
      requiredCueIds: ["cue_mah_weitere_schritte"],
      optionalCueIds: ["cue_mah_letzte_mahnung", "cue_mah_mahnung_heading"],
      minimumEvidenceLevel: "contextual",
      allowedLanes: ["escalation"],
    },
    {
      id: "ev_mah_final_reminder_notice",
      label: "Letzte Mahnung / final reminder stage.",
      requiredCueIds: ["cue_mah_letzte_mahnung"],
      optionalCueIds: ["cue_mah_mahnung_heading", "cue_mah_restbetrag_faellig"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["escalation", "payment"],
    },
    {
      id: "ev_mah_enforcement_vollstreckung",
      label:
        "EXTREME threshold: printed Vollstreckung / Zwangsvollstreckung wording — sole path from generic Mahnung to enforcement_risk without Gerichtsvollzieher/Inkasso.",
      requiredCueIds: ["cue_mah_vollstreckung_explicit"],
      optionalCueIds: ["cue_mah_mahnung_heading"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["escalation"],
    },
    {
      id: "ev_mah_enforcement_gerichtsvollzieher",
      label: "EXTREME threshold: Gerichtsvollzieher explicitly named.",
      requiredCueIds: ["cue_mah_gerichtsvollzieher_explicit"],
      optionalCueIds: ["cue_mah_mahnung_heading"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["escalation"],
    },
    {
      id: "ev_mah_enforcement_inkasso_explicit",
      label: "HIGH threshold: explicit Inkasso assignment / Inkassoverfahren wording (not vague threat).",
      requiredCueIds: ["cue_mah_inkasso_explicit"],
      optionalCueIds: ["cue_mah_mahnung_heading"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["escalation"],
    },
    {
      id: "ev_mah_deadline_payment",
      label: "Payment deadline: calendar tokens only when payment-lane grounded (future 8.2C proximity).",
      requiredCueIds: ["cue_mah_restbetrag_faellig"],
      optionalCueIds: ["cue_mah_bitte_zahlen"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["payment"],
    },
    {
      id: "ev_mah_clarification_possible",
      label: "Clarification / already-paid / contact path present.",
      requiredCueIds: ["cue_mah_clarification_bezahlt"],
      optionalCueIds: ["cue_mah_clarification_kontakt"],
      minimumEvidenceLevel: "contextual",
      allowedLanes: ["clarification"],
    },
    {
      id: "ev_mah_clarification_kontakt_only",
      label: "Alternate clarification path: contact / Rückfragen without already-paid line.",
      requiredCueIds: ["cue_mah_clarification_kontakt"],
      optionalCueIds: ["cue_mah_mahnung_heading"],
      minimumEvidenceLevel: "contextual",
      allowedLanes: ["clarification"],
    },
    {
      id: "ev_mah_informational_only",
      label: "Datenschutz / service boilerplate without dunning obligation surface dominating.",
      requiredCueIds: ["cue_mah_datenschutz_hinweis"],
      optionalCueIds: ["cue_mah_mahnung_heading"],
      minimumEvidenceLevel: "contextual",
      allowedLanes: ["informational"],
    },
  ],

  allowedClaims: [
    {
      claimType: "payment_required",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_mah_payment_required"],
      blockedBy: ["informational_only"],
      minimumConfidence: "medium",
    },
    {
      claimType: "payment_required",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_mah_payment_required_alt"],
      blockedBy: ["informational_only"],
      minimumConfidence: "medium",
    },
    {
      claimType: "payment_overdue",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_mah_payment_overdue"],
      minimumConfidence: "medium",
    },
    {
      claimType: "deadline_present",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_mah_deadline_payment"],
      minimumConfidence: "medium",
    },
    {
      claimType: "clarification_possible",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_mah_clarification_possible"],
      minimumConfidence: "low",
    },
    {
      claimType: "clarification_possible",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_mah_clarification_kontakt_only"],
      minimumConfidence: "low",
    },
    {
      claimType: "informational_only",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_mah_informational_only"],
      minimumConfidence: "low",
    },
    {
      claimType: "enforcement_risk",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_mah_enforcement_vollstreckung"],
      minimumConfidence: "high",
    },
    {
      claimType: "enforcement_risk",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_mah_enforcement_gerichtsvollzieher"],
      minimumConfidence: "high",
    },
    {
      claimType: "enforcement_risk",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_mah_enforcement_inkasso_explicit"],
      minimumConfidence: "high",
    },
  ],

  forbiddenClaims: [
    "immigration_risk",
    "benefit_risk",
    "automatic_salary_garnishment",
    "account_seizure",
    "eviction_risk",
    "criminal_accusation",
    "insurance_risk",
    "appeal_possible",
    "appointment_required",
    "documents_required",
  ],

  hallucinationTraps: [
    {
      id: "trap_mah_to_vollstreckung",
      kind: "mahnung_to_vollstreckung",
      description: "Routine Mahnung or Zahlungserinnerung must not be narrated as active Vollstreckung.",
      dangerousInference:
        "Asserting Vollstreckung läuft, Kontopfändung, or Zwangsvollstreckung has begun when only standard Mahnstufen or weitere Schritte boilerplate appear.",
      blockedInterpretationBehavior:
        "Do not assert enforcement_active or enforcement_risk unless ev_mah_enforcement_* rules fire on explicit tokens; prefer reminder_notice / overdue_payment_notice.",
      relatedClaimTypes: ["enforcement_risk"],
      relatedLanes: ["payment", "escalation"],
    },
    {
      id: "trap_mah_to_gv",
      kind: "mahnung_to_gerichtsvollzieher",
      description: "Gerichtsvollzieher must not appear without explicit wording.",
      dangerousInference: "Inventing Gerichtsvollzieher visits, Pfändung, or Beschlagnahme from generic Mahnung tone.",
      blockedInterpretationBehavior:
        "Name Gerichtsvollzieher only when cue_mah_gerichtsvollzieher_explicit matches; otherwise omit and hedge.",
      relatedLanes: ["escalation"],
    },
    {
      id: "trap_mah_account_seizure",
      kind: "payment_reminder_to_account_seizure",
      description: "Payment reminder ≠ account freeze / P-Konto narrative.",
      dangerousInference: "Describing P-Konto, Kontosperre, or account seizure as imminent from a first/second reminder.",
      blockedInterpretationBehavior:
        "Do not assert account_seizure reality or account_seizure claim; stay with payment_deadline_present / payment_required.",
      relatedClaimTypes: ["enforcement_risk"],
      relatedLanes: ["payment", "escalation"],
    },
    {
      id: "trap_mah_generic_disaster",
      kind: "generic_escalation_to_legal_disaster",
      description: "weitere Schritte / Konsequenzen is not a license for catastrophic legal storytelling.",
      dangerousInference:
        "Turning vague Androhung into court cases, Strafanzeige, Schufa totalverlust, or existential collapse without text.",
      blockedInterpretationBehavior:
        "Treat ev_mah_escalation_warning_present as hedged escalation_warning_present; no court_proceeding or criminal_investigation realities.",
      relatedLanes: ["escalation"],
    },
    {
      id: "trap_mah_letzte_to_enforcement",
      kind: "letzte_mahnung_to_active_enforcement",
      description: "letzte Mahnung raises stakes but does not equal laufende Vollstreckung.",
      dangerousInference: "Equating final reminder with enforcement already executed or bailiff appointment scheduled.",
      blockedInterpretationBehavior:
        "May use final_reminder_notice and higher procedural severity only with explicit escalation evidence — still no fabricated enforcement timeline.",
      relatedLanes: ["escalation", "payment"],
    },
    {
      id: "trap_mah_weitere_to_inkasso",
      kind: "weitere_schritte_to_forced_collection",
      description: "weitere Schritte must not become Inkasso/Vollstreckung narrative without explicit cues.",
      dangerousInference: "Stating Inkasso has been commissioned or Vollstreckung is next week from boilerplate alone.",
      blockedInterpretationBehavior:
        "Require cue_mah_inkasso_explicit or explicit Vollstreckung/GV cues before enforcement_risk; otherwise silent on collection assignment.",
      relatedClaimTypes: ["enforcement_risk"],
      relatedLanes: ["escalation"],
    },
    {
      id: "trap_mah_late_fee_criminal",
      kind: "late_fee_to_criminal_case",
      description: "Mahngebühr / Säumniszuschlag is civil fee logic, not Strafverfahren.",
      dangerousInference: "Linking late fees to Steuerhinterziehung, Betrug, or criminal tax investigation.",
      blockedInterpretationBehavior:
        "Keep fee discussion in possible_late_fee_notice / escalation lane; never assert criminal_accusation or criminal_investigation reality.",
      relatedLanes: ["escalation"],
    },
    {
      id: "trap_mah_insurance_coverage",
      kind: "insurance_reminder_to_loss_of_coverage",
      description: "Contribution or insurer Mahnung must not become coverage termination fiction.",
      dangerousInference: "Asserting health_insurance_termination or total coverage loss from a premium reminder alone.",
      blockedInterpretationBehavior:
        "Do not assert health_insurance_termination reality or insurance_risk claim unless separate decision language exists (outside this matrix).",
      relatedLanes: ["payment", "informational"],
    },
    {
      id: "trap_mah_overdue_eviction",
      kind: "overdue_payment_to_eviction",
      description: "Utility or rent-style overdue wording must not become eviction (Kündigung/Räumung) without explicit housing enforcement text.",
      dangerousInference: "Predicting Räumung, Wohnungsverlust, or eviction_risk from generic Forderung Mahnung.",
      blockedInterpretationBehavior: "Never assert eviction_risk claim or reality on this matrix v1.",
      relatedLanes: ["payment", "escalation"],
    },
    {
      id: "trap_mah_garnishment",
      kind: "overdue_payment_to_salary_garnishment",
      description: "Overdue invoice must not become Lohnpfändung / automatic garnishment story.",
      dangerousInference: "Describing Lohnpfändung, Gehaltsabtretung, or automatic_salary_garnishment as imminent without explicit text.",
      blockedInterpretationBehavior:
        "Do not assert automatic_salary_garnishment claim; describe only what the letter names about further steps.",
      relatedLanes: ["escalation", "payment"],
    },
    {
      id: "trap_mah_emotional_amp",
      kind: "emotional_language_amplification",
      description: "Model must not intensify emotional or catastrophic tone beyond document modality.",
      dangerousInference:
        "Adding panic adjectives, deportation, family ruin, or total social collapse not supported by the Mahnung text.",
      blockedInterpretationBehavior:
        "Calm, short, source-bound phrasing; severity follows proceduralSeverity rules, not stylistic alarm.",
      relatedLanes: ["escalation", "informational"],
    },
    {
      id: "trap_mah_lane_contamination",
      kind: "lane_contamination",
      description: "Payment amounts and escalation boilerplate must not cross-contaminate dates and actors.",
      dangerousInference: "Reusing a payment due date as Gerichtstermin or Inkasso deadline without separate grounding.",
      blockedInterpretationBehavior: "Lane-local token binding in 8.2C; empty deadlines when attribution fails.",
      relatedClaimTypes: ["deadline_present", "enforcement_risk"],
      relatedLanes: ["payment", "escalation"],
    },
  ],

  stabilizers: [
    {
      id: "stab_mah_no_vollstreckung_text",
      triggerConditions: ["No explicit Vollstreckung / Gerichtsvollzieher / Inkassoverfahren wording on the sheet."],
      allowedWordingExamples: [
        "Dokument zatiaľ nespomína vymáhanie (Vollstreckung).",
        "Mahnung znamená upozornenie na neuhradenú platbu, nie automaticky exekučné konanie.",
      ],
      forbiddenWordingExamples: [
        "Vollstreckung läuft bereits.",
        "Gerichtsvollzieher wurde bereits beauftragt.",
      ],
    },
    {
      id: "stab_mah_weitere_schritte_ambiguous",
      triggerConditions: ["Document uses weitere Schritte / Konsequenzen without naming Vollstreckung or GV."],
      allowedWordingExamples: [
        "Pojem 'ďalšie kroky' môže mať viac významov a dokument ich nemusí konkretizovať.",
        "Der Text droht unspezifische Folgen an — konkrete Schritte müssen im Schriftstück genannt sein.",
      ],
      forbiddenWordingExamples: [
        "Sie werden definitiv gepfändet.",
        "Inkasso ist schon aktiv.",
      ],
    },
    {
      id: "stab_mah_explicit_enforcement_careful",
      triggerConditions: ["Explicit Vollstreckung, Gerichtsvollzieher, or Inkassoverfahren wording is printed."],
      allowedWordingExamples: [
        "Ak dokument uvádza Inkasso alebo Vollstreckung explicitne, Vaylo to môže spomenúť len opatrne a doslovne.",
      ],
      forbiddenWordingExamples: [
        "Das ist nur eine leere Drohung.",
        "Sie können ignorieren.",
      ],
    },
    {
      id: "stab_mah_payment_delay",
      triggerConditions: ["falls Sie bereits gezahlt haben or similar appears."],
      allowedWordingExamples: [
        "Ak ste už platbu odoslali, dokument môže byť časovo oneskorený; uschovajte si dôkaz o úhrade a kontaktujte veriteľa.",
      ],
      forbiddenWordingExamples: ["Zahlung ist unwichtig.", "Ignorieren Sie die Frist."],
    },
  ],

  severityRules: [
    {
      id: "sev_mah_low_reminder",
      when: "Zahlungserinnerung / erste Mahnung without Mahngebühr ladder or letzte Mahnung.",
      minimumEvidenceLevel: "strongly_supported",
      realitiesThatMayTrigger: ["reminder_notice", "payment_followup_notice"],
      severity: "low",
    },
    {
      id: "sev_mah_medium_dunning",
      when: "Mahnung with fees or clear überfällig / Restbetrag pressure; no explicit Vollstreckung.",
      minimumEvidenceLevel: "explicit",
      realitiesThatMayTrigger: ["overdue_payment_notice", "possible_late_fee_notice", "payment_deadline_present"],
      blockedWhenRealities: ["enforcement_active"],
      severity: "medium",
    },
    {
      id: "sev_mah_high_final_and_escalation",
      when:
        "letzte Mahnung and/or explicit escalation_warning_present with concrete further-step language — still NOT high solely because tone is strict.",
      minimumEvidenceLevel: "explicit",
      realitiesThatMayTrigger: ["final_reminder_notice", "escalation_warning_present"],
      blockedWhenRealities: ["enforcement_active"],
      severity: "high",
    },
    {
      id: "sev_mah_critical_explicit_enforcement",
      when:
        "ONLY when enforcement_risk claim is admissible via ev_mah_enforcement_* (explicit Vollstreckung / Gerichtsvollzieher / Inkassoverfahren tokens).",
      minimumEvidenceLevel: "explicit",
      claimTypesThatMayTrigger: ["enforcement_risk"],
      severity: "critical",
    },
  ],

  proceduralLanes: ["payment", "escalation", "informational", "clarification"],
} as const satisfies UniversalDocumentRealityMatrix;
