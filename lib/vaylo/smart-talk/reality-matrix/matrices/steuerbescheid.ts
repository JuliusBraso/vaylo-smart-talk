/**
 * Steuerbescheid (Finanzamt tax assessment / Änderungsbescheid) — second production-shaped matrix (Phase 8.2B-2).
 * Declarative only: no matching, no gates, no Steuerberatung semantics.
 *
 * Models what a tax assessment document may support — not tax optimization, not general tax advice.
 */

import type { UniversalDocumentRealityMatrix } from "../types";

export const STEUERBESCHEID_REALITY_MATRIX = {
  schemaVersion: "8.2b-2-steuerbescheid-v1",
  documentType: "steuerbescheid",

  supportedRealities: [
    "tax_assessment_issued",
    "official_decision_issued",
    "tax_decision_issued",
    "tax_payment_due",
    "tax_refund_due",
    "appeal_window_exists",
    "legal_remedy_information_present",
    "provisional_tax_assessment",
    "amended_tax_assessment",
    "tax_calculation_present",
    "document_submission_expected",
    "unknown",
  ],

  blockedRealities: [
    "enforcement_active",
    "criminal_investigation",
    "court_proceeding",
    "immigration_risk",
    "benefit_suspension",
    "jobcenter_sanction",
    "insurance_risk",
    "final_unappealable_decision",
    "tax_fraud_established",
    "active_sanction",
    "invoice_issued",
    "informational_payment_notice",
    "reminder_notice",
  ],

  evidenceCues: [
    {
      id: "cue_stb_steuerbescheid_heading",
      description:
        "Tax assessment document heading / type. OCR: Steuerbescheid vs Bescheid fragments; watch merged lines.",
      keywords: ["Steuerbescheid", "Einkommensteuerbescheid", "Umsatzsteuerbescheid", "Gewerbesteuerbescheid", "Körperschaftsteuerbescheid", "Änderungsbescheid"],
      regexPatterns: ["\\bSteuerbescheid\\b", "\\bEinkommensteuerbescheid\\b"],
      ocrSensitive: true,
      laneOwnership: ["informational"],
    },
    {
      id: "cue_stb_bescheid_finanzamt",
      description: "Official decision shell: Bescheid + Finanzamt.",
      keywords: ["Bescheid", "Finanzamt", "festgesetzt", "Festsetzung"],
      ocrSensitive: true,
      laneOwnership: ["informational"],
    },
    {
      id: "cue_stb_tax_base_lines",
      description: "Assessment content / tax base vocabulary (not payment instruction alone).",
      keywords: [
        "Einkommensteuer",
        "Solidaritätszuschlag",
        "Kirchensteuer",
        "Besteuerungsgrundlagen",
        "Bemessungsgrundlage",
        "Steuerfestsetzung",
      ],
      ocrSensitive: true,
      laneOwnership: ["informational"],
    },
    {
      id: "cue_stb_nachzahlung_zu_zahlen",
      description: "Payment obligation / Nachzahlung cluster — PAYMENT lane only.",
      keywords: ["Nachzahlung", "zu zahlen", "Zahlbetrag", "zahlbar", "fällig", "Fälligkeit", "Zahlungsfrist", "Bankverbindung", "Überweisung"],
      regexPatterns: ["\\bNachzahlung\\b", "\\bZahlungsfrist\\b"],
      ocrSensitive: true,
      laneOwnership: ["payment"],
    },
    {
      id: "cue_stb_erstattung_guthaben",
      description: "Refund / credit cluster — PAYMENT lane (credit direction, not Jobcenter).",
      keywords: ["Erstattung", "Guthaben", "wird erstattet", "verbleibender Betrag", "Abrechnung", "Rückzahlung"],
      ocrSensitive: true,
      laneOwnership: ["payment"],
    },
    {
      id: "cue_stb_einspruch_rechtsbehelf",
      description: "Appeal / remedy procedural shell — APPEAL lane only.",
      keywords: [
        "Einspruch",
        "Rechtsbehelfsbelehrung",
        "Rechtsbehelf",
        "innerhalb eines Monats",
        "Bekanntgabe",
        "schriftlich",
        "elektronisch",
        "ELSTER",
      ],
      regexPatterns: ["\\binnerhalb\\s+eines\\s+Monats\\b", "\\bRechtsbehelfsbelehrung\\b"],
      ocrSensitive: true,
      laneOwnership: ["appeal"],
    },
    {
      id: "cue_stb_bekanntgabe_zugang",
      description: "Notification / service wording tied to appeal clock — APPEAL lane.",
      keywords: ["Bekanntgabe", "Zugang", "bekannt gegeben"],
      ocrSensitive: true,
      laneOwnership: ["appeal"],
    },
    {
      id: "cue_stb_provisional",
      description: "Provisional / reserved assessment wording.",
      keywords: ["vorläufig", "teilweise vorläufig", "unter dem Vorbehalt der Nachprüfung", "Nachprüfung", "vorläufiger Bescheid"],
      ocrSensitive: true,
      laneOwnership: ["informational"],
    },
    {
      id: "cue_stb_amended",
      description: "Amended assessment vocabulary.",
      keywords: ["geändert", "Änderungsbescheid", "wird geändert", "Berichtigung"],
      ocrSensitive: true,
      laneOwnership: ["informational"],
    },
    {
      id: "cue_stb_erlaeuterungen",
      description: "Explanatory / calculation sections — INFORMATIONAL lane.",
      keywords: ["Erläuterung", "Erläuterungen", "Berechnungsgrundlagen", "Rechenweg", "Anlage", "Hinweise"],
      ocrSensitive: true,
      laneOwnership: ["informational"],
    },
    {
      id: "cue_stb_datenschutz_hinweise",
      description: "Generic boilerplate — does not create obligations.",
      keywords: ["Datenschutz", "allgemeine Hinweise", "Informationen zur Datenverarbeitung"],
      ocrSensitive: false,
      laneOwnership: ["informational"],
    },
    {
      id: "cue_stb_submission_mitwirkung",
      description: "Submission / cooperation requests — SUBMISSION lane.",
      keywords: ["Nachweis", "Nachweise", "Unterlagen", "Mitwirkung", "ergänzende Angaben", "vorzulegen", "einzureichen"],
      ocrSensitive: true,
      laneOwnership: ["submission"],
    },
    {
      id: "cue_stb_calendar_token_payment",
      description:
        "Declarative placeholder: future gate binds DD.MM.YYYY / ISO only when token appears in payment-lane window near Zahlungsfrist/zahlbar (not executed here).",
      regexPatterns: ["\\b\\d{1,2}\\.\\d{1,2}\\.\\d{4}\\b", "\\b\\d{4}-\\d{2}-\\d{2}\\b"],
      ocrSensitive: true,
      laneOwnership: ["payment"],
    },
    {
      id: "cue_stb_steuerjahr",
      description: "Tax year / Veranlagungsjahr — informational anchor, NOT a procedural deadline.",
      keywords: ["Veranlagungsjahr", "Steuerjahr", "Kalenderjahr"],
      ocrSensitive: true,
      laneOwnership: ["informational"],
    },
  ],

  evidenceRules: [
    {
      id: "ev_stb_tax_assessment_issued",
      label: "Tax assessment document type + Festsetzung / Finanzamt shell present.",
      requiredCueIds: ["cue_stb_steuerbescheid_heading"],
      optionalCueIds: ["cue_stb_bescheid_finanzamt", "cue_stb_tax_base_lines"],
      minimumEvidenceLevel: "strongly_supported",
      allowedLanes: ["informational"],
    },
    {
      id: "ev_stb_tax_assessment_issued_alt",
      label: "Alternate path: Bescheid + Finanzamt + tax base without Steuerbescheid heading (OCR title loss).",
      requiredCueIds: ["cue_stb_bescheid_finanzamt", "cue_stb_tax_base_lines"],
      optionalCueIds: ["cue_stb_steuerbescheid_heading"],
      minimumEvidenceLevel: "strongly_supported",
      allowedLanes: ["informational"],
    },
    {
      id: "ev_stb_official_decision",
      label: "Official decision issued: Bescheid + festgesetzt / Festsetzung cluster.",
      requiredCueIds: ["cue_stb_bescheid_finanzamt"],
      optionalCueIds: ["cue_stb_tax_base_lines", "cue_stb_steuerbescheid_heading"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["informational"],
    },
    {
      id: "ev_stb_tax_payment_due",
      label: "Nachzahlung / zu zahlen / Zahlungsfrist — payment lane; not appeal-relative Frist.",
      requiredCueIds: ["cue_stb_nachzahlung_zu_zahlen"],
      optionalCueIds: ["cue_stb_calendar_token_payment"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["payment"],
    },
    {
      id: "ev_stb_tax_refund_due",
      label: "Refund / Erstattung / Guthaben — payment lane (credit); do not confuse with Nachzahlung.",
      requiredCueIds: ["cue_stb_erstattung_guthaben"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["payment"],
    },
    {
      id: "ev_stb_appeal_possible",
      label: "Einspruch + Rechtsbehelfsbelehrung / innerhalb eines Monats — appeal lane only.",
      requiredCueIds: ["cue_stb_einspruch_rechtsbehelf"],
      optionalCueIds: ["cue_stb_bekanntgabe_zugang"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["appeal"],
    },
    {
      id: "ev_stb_deadline_payment_explicit",
      label:
        "Explicit payment calendar deadline: only when printed date token is payment-lane grounded (future 8.2C proximity). Never Steuerjahr or Ausstellungsdatum alone.",
      requiredCueIds: ["cue_stb_nachzahlung_zu_zahlen"],
      optionalCueIds: ["cue_stb_calendar_token_payment"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["payment"],
    },
    {
      id: "ev_stb_deadline_appeal_relative",
      label:
        "Relative appeal window only (e.g. innerhalb eines Monats nach Bekanntgabe): appeal lane; NEVER synthesize concrete end date; letter date ≠ Fristende.",
      requiredCueIds: ["cue_stb_einspruch_rechtsbehelf"],
      optionalCueIds: ["cue_stb_bekanntgabe_zugang"],
      minimumEvidenceLevel: "contextual",
      allowedLanes: ["appeal"],
    },
    {
      id: "ev_stb_provisional_tax_assessment",
      label: "Provisional assessment (vorläufig / Vorbehalt Nachprüfung).",
      requiredCueIds: ["cue_stb_provisional"],
      optionalCueIds: ["cue_stb_bescheid_finanzamt"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["informational"],
    },
    {
      id: "ev_stb_amended_tax_assessment",
      label: "Änderungsbescheid / geänderte Festsetzung.",
      requiredCueIds: ["cue_stb_amended"],
      optionalCueIds: ["cue_stb_bescheid_finanzamt"],
      minimumEvidenceLevel: "explicit",
      allowedLanes: ["informational"],
    },
    {
      id: "ev_stb_tax_calculation_present",
      label: "Calculation / Erläuterungen present (pedagogical weight, not obligation).",
      requiredCueIds: ["cue_stb_erlaeuterungen"],
      optionalCueIds: ["cue_stb_tax_base_lines"],
      minimumEvidenceLevel: "contextual",
      allowedLanes: ["informational"],
    },
    {
      id: "ev_stb_legal_remedy_information",
      label: "Rechtsbehelf information surface without full payment/appeal commitment (hedged informational).",
      requiredCueIds: ["cue_stb_einspruch_rechtsbehelf"],
      optionalCueIds: ["cue_stb_datenschutz_hinweise"],
      minimumEvidenceLevel: "contextual",
      allowedLanes: ["appeal", "informational"],
    },
    {
      id: "ev_stb_documents_required",
      label: "Submission / Nachweise / Mitwirkung — submission lane.",
      requiredCueIds: ["cue_stb_submission_mitwirkung"],
      optionalCueIds: ["cue_stb_bescheid_finanzamt"],
      minimumEvidenceLevel: "contextual",
      allowedLanes: ["submission"],
    },
    {
      id: "ev_stb_informational_only",
      label: "Erläuterungen / Hinweise without Nachzahlung line dominating (weak informational).",
      requiredCueIds: ["cue_stb_erlaeuterungen"],
      optionalCueIds: ["cue_stb_datenschutz_hinweise"],
      minimumEvidenceLevel: "contextual",
      allowedLanes: ["informational"],
    },
  ],

  allowedClaims: [
    {
      claimType: "appeal_possible",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_stb_appeal_possible"],
      minimumConfidence: "medium",
    },
    {
      claimType: "payment_required",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_stb_tax_payment_due"],
      blockedBy: ["informational_only"],
      minimumConfidence: "medium",
    },
    {
      claimType: "deadline_present",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_stb_deadline_payment_explicit"],
      minimumConfidence: "high",
    },
    {
      claimType: "deadline_present",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_stb_deadline_appeal_relative"],
      minimumConfidence: "low",
    },
    {
      claimType: "documents_required",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_stb_documents_required"],
      minimumConfidence: "low",
    },
    {
      claimType: "informational_only",
      allowed: true,
      requiredEvidenceRuleIds: ["ev_stb_informational_only"],
      minimumConfidence: "low",
    },
  ],

  forbiddenClaims: ["enforcement_risk", "benefit_risk", "insurance_risk", "appointment_required"],

  hallucinationTraps: [
    {
      id: "trap_stb_appeal_deadline_synthesis",
      kind: "appeal_deadline_synthesis",
      description: "Relative Einspruch window must not become a fabricated calendar day.",
      dangerousInference:
        "Emitting ‘Einspruch bis DD.MM.YYYY’ computed from Ausstellungsdatum, letter date, Steuerjahr, or postal assumptions when only innerhalb eines Monats nach Bekanntgabe is printed.",
      blockedInterpretationBehavior:
        "Keep appeal timing relative to Bekanntgabe/Zugang as printed; omit synthetic dates; use appeal-lane wording only (future gate enforces cue proximity on any calendar token).",
      relatedClaimTypes: ["deadline_present", "appeal_possible"],
      relatedLanes: ["appeal"],
    },
    {
      id: "trap_stb_bescheid_date_to_appeal",
      kind: "bescheid_date_to_appeal_deadline",
      description: "Bescheiddatum / Ausstellungsdatum is not the appeal cutoff.",
      dangerousInference: "Treating the document issue date or footer date as the last day for Einspruch.",
      blockedInterpretationBehavior:
        "Do not equate Ausstellungsdatum with Fristende; appeal clock runs from Bekanntgabe/Zugang as stated, not from arbitrary printed dates.",
      relatedLanes: ["appeal", "informational"],
    },
    {
      id: "trap_stb_payment_deadline_to_appeal",
      kind: "payment_deadline_to_appeal_deadline",
      description: "Zahlungsfrist must not be narrated as Einspruchsfrist.",
      dangerousInference: "Using the printed tax payment due date as the objection deadline or vice versa.",
      blockedInterpretationBehavior:
        "Bind payment calendar tokens only to payment_required / tax_payment_due; bind relative appeal text only to appeal_window_exists / appeal_possible — never commute lanes.",
      relatedClaimTypes: ["deadline_present", "payment_required"],
      relatedLanes: ["payment", "appeal"],
    },
    {
      id: "trap_stb_appeal_deadline_to_payment",
      kind: "appeal_deadline_to_payment_deadline",
      description: "Einspruch-relative wording must not set the tax payment due narrative.",
      dangerousInference:
        "Telling the user to pay by the same calendar date printed only next to Rechtsbehelfsbelehrung / innerhalb eines Monats.",
      blockedInterpretationBehavior:
        "Separate payment instructions (Nachzahlung, Zahlungsfrist) from appeal instructions; payment deadlines only from payment-lane grounded cues.",
      relatedClaimTypes: ["deadline_present", "payment_required"],
      relatedLanes: ["payment", "appeal"],
    },
    {
      id: "trap_stb_rechtsbehelf_to_panic",
      kind: "rechtsbehelfsbelehrung_to_active_threat",
      description: "Rechtsbehelfsbelehrung is procedural information, not an active sanction.",
      dangerousInference:
        "Framing the remedy instruction block as immediate existential/legal crisis, Jobcenter sanction, or enforcement already underway.",
      blockedInterpretationBehavior:
        "Describe as standard notification of appeal rights; calm modality; no invented consequences beyond the text.",
      relatedLanes: ["appeal", "informational"],
    },
    {
      id: "trap_stb_steuer_to_enforcement",
      kind: "steuerbescheid_to_enforcement",
      description: "Finanzamt Steuerbescheid is not a Vollstreckungsbescheid by default.",
      dangerousInference: "Asserting enforcement_active, bailiff, or forced collection from a routine assessment absent explicit enforcement language.",
      blockedInterpretationBehavior:
        "Do not assert enforcement_risk or enforcement realities; if explicit Inkasso/Vollstreckung text appears, treat as out-of-band matrix exception (governance), not this v1 matrix.",
      relatedClaimTypes: ["enforcement_risk"],
      relatedLanes: ["payment", "informational"],
    },
    {
      id: "trap_stb_tax_to_criminal",
      kind: "tax_assessment_to_criminal_case",
      description: "Steuerfestsetzung is not Steuerstrafverfahren.",
      dangerousInference: "Inferring criminal tax fraud, Steuerhinterziehung, or investigation from a civil assessment notice.",
      blockedInterpretationBehavior:
        "Never assert tax_fraud_established or criminal_investigation; keep language within Festsetzung / Nachzahlung / Einspruch scope.",
      relatedLanes: ["informational"],
    },
    {
      id: "trap_stb_refund_payment_confusion",
      kind: "refund_payment_confusion",
      description: "Erstattung / Guthaben must not be read as Nachzahlungspflicht.",
      dangerousInference: "Telling the user they must pay an amount that the letter states as refund or credit, or reversing signs.",
      blockedInterpretationBehavior:
        "Separate tax_refund_due from tax_payment_due using payment-lane cues; hedge when tables are ambiguous under OCR.",
      relatedClaimTypes: ["payment_required"],
      relatedLanes: ["payment"],
    },
    {
      id: "trap_stb_finanzamt_jobcenter",
      kind: "finanzamt_to_jobcenter_confusion",
      description: "Finanzamt tax decision must not be reframed as Jobcenter/Leistung sanction.",
      dangerousInference: "Linking tax assessment to benefit cuts, Bürgergeld sanctions, or immigration consequences without text.",
      blockedInterpretationBehavior:
        "Do not assert jobcenter_sanction, benefit_suspension, or immigration_risk; stay within tax administration scope.",
      relatedLanes: ["informational"],
    },
    {
      id: "trap_stb_provisional_to_final",
      kind: "provisional_to_final_decision",
      description: "Vorläufig / Nachprüfungsvorbehalt must not be narrated as unappealable finality.",
      dangerousInference: "Stating the assessment is final and unchallengeable while vorläufig or Vorbehalt language is printed.",
      blockedInterpretationBehavior:
        "Preserve provisional modality; do not assert final_unappealable_decision; align appeal_possible with printed Rechtsbehelfe.",
      relatedLanes: ["informational", "appeal"],
    },
    {
      id: "trap_stb_bekanntgabe_invention",
      kind: "bekanntgabe_date_invention",
      description: "Do not invent a Bekanntgabe/Zugang date to anchor the one-month window.",
      dangerousInference: "Fabricating a service date to compute Einspruch deadline when only relative wording exists.",
      blockedInterpretationBehavior:
        "State dependence on actual Zugang/Bekanntgabe; no synthetic calendar anchor from unrelated document dates.",
      relatedLanes: ["appeal"],
    },
    {
      id: "trap_stb_lane_contamination",
      kind: "lane_contamination",
      description: "Steuerjahr, Ausstellungsdatum, and Kontoauszug-style dates must not migrate into wrong lanes.",
      dangerousInference: "Using Veranlagungsjahr or random DD.MM.YYYY as payment or appeal Frist without lane-local grounding.",
      blockedInterpretationBehavior:
        "Future gate: lane-scoped token binding only; empty deadline arrays when attribution fails (aligns with Smart Talk 7.8C discipline).",
      relatedClaimTypes: ["deadline_present"],
      relatedLanes: ["payment", "appeal", "informational"],
    },
    {
      id: "trap_stb_steuerjahr_not_deadline",
      kind: "semantic_drift",
      description: "Steuerjahr labels a tax period, not a procedural deadline.",
      dangerousInference: "Describing the calendar year of taxation as the day by which the user must act.",
      blockedInterpretationBehavior: "Keep Steuerjahr in informational explanation only; never as Fristsubstitut.",
      relatedLanes: ["informational"],
    },
  ],

  stabilizers: [
    {
      id: "stab_stb_rechtsbehelf_informational",
      triggerConditions: ["Rechtsbehelfsbelehrung / Einspruch block present without enforcement wording."],
      allowedWordingExamples: [
        "Poučenie o odvolaní (Rechtsbehelfsbelehrung) znamená možnosť podať Einspruch, nie automatický problém.",
        "Die Rechtsbehelfsbelehrung informiert über Einspruchsmöglichkeit — sie ist kein Strafbescheid.",
      ],
      forbiddenWordingExamples: [
        "Stehen unter Strafverfolgung.",
        "Sofortige Abschiebung oder Leistungsentzug droht.",
      ],
    },
    {
      id: "stab_stb_no_enforcement_text",
      triggerConditions: ["No Vollstreckung / Gerichtsvollzieher / Inkasso language on the assessment sheet."],
      allowedWordingExamples: ["Dokument zatiaľ nespomína vymáhanie (Vollstreckung)."],
      forbiddenWordingExamples: ["Vollstreckung hat bereits begonnen.", "Inkasso ist unvermeidlich."],
    },
    {
      id: "stab_stb_relative_appeal_no_synthesis",
      triggerConditions: ["Appeal window described only relative to Bekanntgabe/Zugang."],
      allowedWordingExamples: [
        "Ak je lehota uvedená ako jeden mesiac od doručenia, Vaylo z nej nesmie vyrátať konkrétny dátum.",
      ],
      forbiddenWordingExamples: ["Einspruchsfrist endet am 31.03.2026 (ohne gedrucktes Datum)."],
    },
    {
      id: "stab_stb_payment_vs_appeal_separate",
      triggerConditions: ["Both payment and appeal sections appear in the document."],
      allowedWordingExamples: [
        "Platobná lehota a lehota na Einspruch sú samostatné veci.",
        "Zahlungsfrist und Einspruchsfrist sind getrennt zu lesen.",
      ],
      forbiddenWordingExamples: [
        "Die Zahlungsfrist ist zugleich die letzte Einspruchsmöglichkeit.",
      ],
    },
  ],

  severityRules: [
    {
      id: "sev_stb_low_refund",
      when: "tax_refund_due / Erstattung surface without Nachzahlung pressure.",
      minimumEvidenceLevel: "explicit",
      realitiesThatMayTrigger: ["tax_refund_due"],
      severity: "low",
    },
    {
      id: "sev_stb_medium_assessment_core",
      when: "Official tax assessment with Nachzahlung or Einspruch / Zahlungsfrist relevance.",
      minimumEvidenceLevel: "explicit",
      realitiesThatMayTrigger: ["tax_assessment_issued", "official_decision_issued", "tax_payment_due", "appeal_window_exists"],
      severity: "medium",
    },
    {
      id: "sev_stb_medium_provisional",
      when: "Provisional assessment (vorläufig / Nachprüfung) — procedural weight without panic.",
      minimumEvidenceLevel: "explicit",
      realitiesThatMayTrigger: ["provisional_tax_assessment"],
      severity: "medium",
    },
    {
      id: "sev_stb_none_pure_informational",
      when: "Erläuterungen / Datenschutz-only informational surface.",
      minimumEvidenceLevel: "contextual",
      realitiesThatMayTrigger: ["tax_calculation_present"],
      blockedWhenRealities: ["tax_payment_due", "tax_refund_due"],
      severity: "none",
    },
    {
      id: "sev_stb_high_explicit_serious_language",
      when:
        "ONLY when the same document explicitly names severe collection / Säumnis escalation (rare on a plain Steuerbescheid). Future gate must verify explicit tokens; matrix marks ceiling — not default severity.",
      minimumEvidenceLevel: "explicit",
      realitiesThatMayTrigger: ["tax_payment_due"],
      severity: "high",
    },
  ],

  proceduralLanes: ["payment", "appeal", "informational", "submission"],
} as const satisfies UniversalDocumentRealityMatrix;
