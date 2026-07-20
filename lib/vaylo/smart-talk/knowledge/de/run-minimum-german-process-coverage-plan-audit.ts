/**
 * PHASE 9D — Minimum German Process Coverage Plan Audit
 * (Plan and Audit Only)
 *
 * This file defines a deterministic, immutable Minimum Viable German
 * Knowledge System process-coverage plan for Birello Smart Talk — built on
 * PHASE 9A (architecture boundary), PHASE 9B (source hierarchy / trust
 * contract) and PHASE 9C (jurisdiction / effective-date model). It performs
 * NO dynamic execution: no network, no source ingestion, no authority
 * registration, no database, no migration, no embeddings, no retrieval,
 * no model call, no OCR, no DE<->SK connector implementation, no
 * user-content persistence, no environment mutation.
 *
 * It only:
 *   1. Declares immutable, type-only planning contracts (eight initial
 *      process groups, three-wave plan, ProcessCoveragePlan entity, risk
 *      levels, process-depth levels, claim-type mapping, source/authority
 *      coverage requirements, regional/pilot-region policy, document-class
 *      coverage, deadline/fee policy, responsible-actor policy, DE<->SK
 *      preparation without implementation, deferred German scope, testing
 *      requirements, exit criteria).
 *   2. Reads the PHASE 9A, 9B and 9C audit files and the PHASE 8.13C
 *      closure audit as plain text via `fs.readFileSync` (never imports or
 *      executes them) to ground a few conservative booleans.
 *   3. Runs read-only `git` commands to confirm this phase created exactly
 *      one new file and modified no existing file.
 *   4. Runs 160 pure, in-memory tamper cases against a deep-cloned "good"
 *      Result and confirms each mutation is rejected.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SOURCE_CLOSURE_COMMIT = "4c80e61";
const SOURCE_ARCHITECTURE_CHECK_ID = "9A";
const SOURCE_TRUST_CONTRACT_CHECK_ID = "9B";
const SOURCE_JURISDICTION_MODEL_CHECK_ID = "9C";

const PHASE_9A_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-knowledge-system-boundary-architecture-gate-design-audit.ts";
const PHASE_9B_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-source-hierarchy-trust-contract-audit.ts";
const PHASE_9C_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-jurisdiction-effective-date-model-audit.ts";
const CLOSURE_8_13C_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-smart-talk-desktop-responsive-browser-validation-closure-audit.ts";
const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-minimum-german-process-coverage-plan-audit.ts";

const LAUNCH_LOCALES = ["de", "en", "sk", "cs", "pl", "hu"] as const;

function runGitReadOnly(cmd: string): string {
  try {
    return execSync(cmd, { encoding: "utf8", cwd: process.cwd() }).trim();
  } catch {
    return "";
  }
}

function readFileText(relPath: string): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), relPath), "utf8").replace(/\r\n/g, "\n");
  } catch {
    return "";
  }
}

function fileExists(relPath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), relPath));
  } catch {
    return false;
  }
}

// ============================================================================
// INITIAL PROCESS GROUPS (exactly 8 — no silent additions)
// ============================================================================

type ProcessGroupId =
  | "anmeldung_ummeldung_abmeldung"
  | "steuer_id_and_basic_finanzamt_letters"
  | "health_insurance_orientation"
  | "jobcenter_buergergeld"
  | "familienkasse_kindergeld"
  | "rechnung_mahnung"
  | "kuendigung_orientation"
  | "auslaenderbehoerde_limited_orientation";

const INITIAL_PROCESS_GROUPS: readonly ProcessGroupId[] = [
  "anmeldung_ummeldung_abmeldung",
  "steuer_id_and_basic_finanzamt_letters",
  "health_insurance_orientation",
  "jobcenter_buergergeld",
  "familienkasse_kindergeld",
  "rechnung_mahnung",
  "kuendigung_orientation",
  "auslaenderbehoerde_limited_orientation",
];

// ============================================================================
// WAVE PLAN
// ============================================================================

const WAVE_ONE_GROUPS: readonly ProcessGroupId[] = [
  "anmeldung_ummeldung_abmeldung",
  "rechnung_mahnung",
  "health_insurance_orientation",
];
const WAVE_TWO_GROUPS: readonly ProcessGroupId[] = [
  "jobcenter_buergergeld",
  "familienkasse_kindergeld",
  "steuer_id_and_basic_finanzamt_letters",
];
const WAVE_THREE_GROUPS: readonly ProcessGroupId[] = [
  "kuendigung_orientation",
  "auslaenderbehoerde_limited_orientation",
];

const WAVE_ORDERING_RATIONALE_FACTORS: readonly string[] = [
  "user frequency", "urgency", "financial harm", "legal risk", "source availability",
  "regional complexity", "authority complexity", "cross-border relevance", "suitability for controlled testing",
];

const WAVE_RATIONALE: Readonly<Record<1 | 2 | 3, string>> = {
  1: "Wave 1 covers the highest-frequency, lowest-ambiguity, and most testable situations: everyone who moves needs Anmeldung/Ummeldung/Abmeldung (very high frequency, mostly document-driven, well suited to a controlled pilot region); Rechnung/Mahnung affects nearly all users and is largely document-classification work with contained legal risk; health-insurance orientation is high-frequency, mostly explanatory, and prepares (without implementing) the future cross-border insurance connector.",
  2: "Wave 2 covers higher financial-harm and higher authority-complexity topics that need Wave-1 groundwork first: Jobcenter/Buergergeld and Familienkasse/Kindergeld involve more authority steps, longer document chains and (for Kindergeld) the first DE<->SK cross-border preparation; Steuer-ID/Finanzamt letters need the jurisdiction/effective-date model exercised in Wave 1 before touching deadline-sensitive tax correspondence.",
  3: "Wave 3 covers the most legally sensitive and most restricted topics: Kuendigung orientation requires careful document-type distinctions with legal-validity determination fully blocked; Auslaenderbehoerde limited orientation carries the highest legal risk (immigration status, asylum adjacency) and is deliberately implemented last, with the strongest safety restrictions, after all governance patterns from Waves 1-2 are proven.",
};

// ============================================================================
// RISK LEVELS AND PROCESS DEPTH LEVELS
// ============================================================================

type RiskLevel = "low" | "medium" | "high" | "mixed";
const RISK_LEVELS: readonly RiskLevel[] = ["low", "medium", "high", "mixed"];

type ProcessDepthLevel =
  | "terminology_only"
  | "basic_orientation"
  | "structured_process_guidance"
  | "document_explanation"
  | "safe_next_step"
  | "high_risk_warning"
  | "exact_deadline"
  | "eligibility_determination"
  | "legal_validity_determination"
  | "official_submission"
  | "legal_representation";

const PROCESS_DEPTH_LEVELS: readonly ProcessDepthLevel[] = [
  "terminology_only", "basic_orientation", "structured_process_guidance", "document_explanation",
  "safe_next_step", "high_risk_warning", "exact_deadline", "eligibility_determination",
  "legal_validity_determination", "official_submission", "legal_representation",
];

const ALLOWED_INITIAL_DEPTHS: readonly ProcessDepthLevel[] = [
  "terminology_only", "basic_orientation", "structured_process_guidance",
  "document_explanation", "safe_next_step", "high_risk_warning",
];
const RESTRICTED_INITIAL_DEPTHS: readonly ProcessDepthLevel[] = ["exact_deadline"];
const BLOCKED_INITIAL_DEPTHS: readonly ProcessDepthLevel[] = [
  "eligibility_determination", "legal_validity_determination", "official_submission", "legal_representation",
];

// ============================================================================
// CLAIM TYPES (from 9B) — not every type required for every process
// ============================================================================

type ClaimType =
  | "legal_rule" | "eligibility_rule" | "deadline_rule" | "fee_rule" | "required_document_rule"
  | "authority_competence" | "procedural_step" | "form_requirement" | "appeal_information"
  | "documentary_fact" | "general_orientation" | "safe_next_step" | "responsible_actor_rule"
  | "unresolved_interpretation";

const CLAIM_TYPES: readonly ClaimType[] = [
  "legal_rule", "eligibility_rule", "deadline_rule", "fee_rule", "required_document_rule",
  "authority_competence", "procedural_step", "form_requirement", "appeal_information",
  "documentary_fact", "general_orientation", "safe_next_step", "responsible_actor_rule", "unresolved_interpretation",
];

// ============================================================================
// SOURCE / AUTHORITY / DOCUMENT / REGIONAL / DEADLINE / FEE / ACTOR MODELS
// ============================================================================

const SOURCE_COVERAGE_CATEGORIES: readonly string[] = [
  "controlling_or_eligible_legal_procedural_source", "competent_authority_source",
  "official_form_or_instructions", "local_authority_source_for_municipality_specific_procedure",
  "direct_passage_for_high_risk_claims", "version_and_effective_date_metadata",
  "original_german_citation", "review_status_accepted_for_intended_use",
];

type AuthorityCategory =
  | "registration_authority" | "finanzamt" | "health_insurance_body" | "jobcenter" | "familienkasse"
  | "court_or_mahnverfahren_authority" | "employer_related_authority"
  | "tenancy_related_public_information_authority" | "auslaenderbehoerde";

const AUTHORITY_CATEGORIES: readonly AuthorityCategory[] = [
  "registration_authority", "finanzamt", "health_insurance_body", "jobcenter", "familienkasse",
  "court_or_mahnverfahren_authority", "employer_related_authority",
  "tenancy_related_public_information_authority", "auslaenderbehoerde",
];

type RegionalCoverageState =
  | "federal_core_ready" | "selected_local_examples_ready" | "pilot_region_ready"
  | "regional_gap_known" | "authority_specific_gap_known" | "nationwide_local_coverage_not_complete";

const REGIONAL_COVERAGE_STATES: readonly RegionalCoverageState[] = [
  "federal_core_ready", "selected_local_examples_ready", "pilot_region_ready",
  "regional_gap_known", "authority_specific_gap_known", "nationwide_local_coverage_not_complete",
];

const PILOT_REGION_STRATEGY_ELEMENTS: readonly string[] = [
  "one initial German pilot municipality or city", "one validated authority pathway per locally variable process",
  "explicit fallback when outside pilot region", "no national generalization from pilot coverage",
];
const PILOT_CITY_SELECTED_THIS_PHASE = false as const;

type DocumentClass =
  | "appointment_notice" | "request_for_information" | "request_for_documents" | "decision_notice"
  | "payment_request" | "reminder" | "repayment_request" | "termination_letter"
  | "registration_confirmation_or_notice" | "insurance_membership_contribution_notice"
  | "authority_deadline_notice" | "court_mahnbescheid_warning";

const DOCUMENT_CLASSES: readonly DocumentClass[] = [
  "appointment_notice", "request_for_information", "request_for_documents", "decision_notice",
  "payment_request", "reminder", "repayment_request", "termination_letter",
  "registration_confirmation_or_notice", "insurance_membership_contribution_notice",
  "authority_deadline_notice", "court_mahnbescheid_warning",
];
const DOCUMENT_CLASSIFICATION_AUTHORIZES_LEGAL_CONCLUSION = false as const;

type DeadlineHandlingLevel =
  | "stated_date_only" | "stated_deadline_explanation" | "urgency_warning"
  | "calculation_blocked" | "exact_calculation_authorized_only_with_evidence";

const DEADLINE_HANDLING_LEVELS: readonly DeadlineHandlingLevel[] = [
  "stated_date_only", "stated_deadline_explanation", "urgency_warning",
  "calculation_blocked", "exact_calculation_authorized_only_with_evidence",
];

type FeePolicyState =
  | "no_fee_expected" | "fee_possible" | "local_fee_possible" | "fee_stated_in_source"
  | "fee_stated_in_document" | "fee_unknown" | "fee_conflict" | "fee_requires_verification";

const FEE_POLICY_STATES: readonly FeePolicyState[] = [
  "no_fee_expected", "fee_possible", "local_fee_possible", "fee_stated_in_source",
  "fee_stated_in_document", "fee_unknown", "fee_conflict", "fee_requires_verification",
];
const FEE_INFERRED_FROM_STALE_SOURCE_ALLOWED = false as const;

type ResponsibleActor =
  | "user" | "employer" | "insurer" | "german_authority" | "foreign_authority" | "court"
  | "landlord" | "service_provider" | "institution_to_institution_exchange" | "unresolved";

const RESPONSIBLE_ACTORS: readonly ResponsibleActor[] = [
  "user", "employer", "insurer", "german_authority", "foreign_authority", "court",
  "landlord", "service_provider", "institution_to_institution_exchange", "unresolved",
];
const CONCRETE_INSTRUCTION_ALLOWED_WITH_UNRESOLVED_ACTOR = false as const;

// ============================================================================
// TESTING REQUIREMENTS
// ============================================================================

const STANDARD_TESTING_REQUIREMENTS: readonly string[] = [
  "source_contract_test", "jurisdiction_test", "effective_date_test", "authority_competence_test",
  "document_classification_test", "citation_test", "blocked_output_test", "localization_parity_test",
  "no_persistence_test", "regression_test", "tamper_test", "high_risk_escalation_test",
];
const CROSS_BORDER_TESTING_REQUIREMENTS: readonly string[] = [
  "trust_domain_completeness_test", "responsible_actor_test", "temporal_alignment_test",
  "locale_independent_connector_activation_test",
];

// ============================================================================
// DEFERRED GERMAN SCOPE
// ============================================================================

const DEFERRED_GERMAN_SCOPE: readonly string[] = [
  "complete_immigration_law", "asylum", "full_employment_law", "full_tenancy_law", "court_litigation",
  "enforcement_and_insolvency", "complete_tax_return_preparation", "full_pension_law",
  "complex_disability_or_health_related_benefits", "medical_advice", "criminal_law",
  "business_licensing", "corporate_taxation", "family_court", "full_consumer_credit_litigation",
];

// ============================================================================
// DE<->SK PREPARATION (preparation only — no implementation)
// ============================================================================

const DE_SK_PREPARATION_PRIORITY_TOPICS: readonly ProcessGroupId[] = [
  "familienkasse_kindergeld", "health_insurance_orientation", "jobcenter_buergergeld", "steuer_id_and_basic_finanzamt_letters",
];
const DE_SK_FIRST_PILOT_TOPIC: ProcessGroupId = "familienkasse_kindergeld";
const DE_SK_PILOT_REQUIREMENTS: readonly string[] = [
  "applicable_eu_coordination_evidence", "german_familienkasse_evidence", "verified_slovak_competent_source_evidence",
  "resolved_responsible_actor", "resolved_authority_competence", "aligned_effective_dates",
  "citations_from_each_required_trust_domain",
];
const DE_SK_CONNECTOR_IMPLEMENTED_THIS_PHASE = false as const;
const DE_SK_ACTIVATED_FROM_OUTPUT_LOCALE = false as const;

// ============================================================================
// PER-PROCESS MINIMUM COVERAGE (grounded, exact counts from the objective)
// ============================================================================

interface ProcessTopicSpec {
  processGroupId: ProcessGroupId;
  title: string;
  riskLevel: RiskLevel;
  distinguish: readonly string[];
  coverageItems: readonly string[];
  mustNotClaim: readonly string[];
  crossBorderPreparationRelevant: boolean;
}

const PROCESS_TOPIC_SPECS: readonly ProcessTopicSpec[] = [
  {
    processGroupId: "anmeldung_ummeldung_abmeldung",
    title: "Anmeldung / Ummeldung / Abmeldung",
    riskLevel: "low",
    distinguish: [],
    coverageItems: [
      "distinction between Anmeldung, Ummeldung and Abmeldung", "typical trigger situations",
      "Wohnungsgeberbestaetigung", "commonly required document categories",
      "competent local registration authority concept", "municipality-specific procedure warning",
      "appointment versus online procedure distinction", "expected outcome document",
      "safe next step", "regional/local variation", "date-sensitive obligations only with authorized evidence",
    ],
    mustNotClaim: [
      "one nationwide appointment procedure", "one universal document list for every municipality",
      "one authority valid for all users", "exact deadline without verified jurisdiction and source",
      "successful registration status",
    ],
    crossBorderPreparationRelevant: false,
  },
  {
    processGroupId: "steuer_id_and_basic_finanzamt_letters",
    title: "Steuer-ID and basic Finanzamt letters",
    riskLevel: "mixed",
    distinguish: ["Aufforderung", "Erinnerung", "Bescheid", "Zahlungsaufforderung", "information request"],
    coverageItems: [
      "distinction between Steuer-ID and Steuernummer", "basic purpose of Steuer-ID",
      "common letter classes", "sender and authority identification", "requested action",
      "stated dates and stated deadlines", "safe verification step", "basic Einspruch terminology only",
      "document explanation without complete tax advice",
    ],
    mustNotClaim: [
      "tax return preparation", "tax-liability determination", "tax-residency determination",
      "binding tax calculation", "automatic Einspruch drafting as legally sufficient",
      "exact appeal deadline without authorized evidence", "professional tax-adviser substitution",
    ],
    crossBorderPreparationRelevant: true,
  },
  {
    processGroupId: "health_insurance_orientation",
    title: "Health insurance orientation",
    riskLevel: "medium",
    distinguish: [],
    coverageItems: [
      "gesetzlich versus privat at orientation level", "membership confirmation", "insurance card",
      "change of employment", "period without employment", "contribution or missing-information letters",
      "Familienversicherung orientation", "user/employer/insurer actor distinction", "safe next step",
      "preparation for future cross-border insurance connector",
    ],
    mustNotClaim: [
      "medical advice", "diagnosis", "treatment eligibility", "final insurance-status determination",
      "final contribution calculation", "cross-border insurance instruction before connector implementation",
    ],
    crossBorderPreparationRelevant: true,
  },
  {
    processGroupId: "jobcenter_buergergeld",
    title: "Jobcenter / Buergergeld",
    riskLevel: "high",
    distinguish: [],
    coverageItems: [
      "Antrag", "Weiterbewilligungsantrag", "Veraenderungsmitteilung", "Mitwirkung",
      "Aufforderung zur Mitwirkung", "Bescheid", "vorlaeufige Bewilligung", "Rueckforderung",
      "Ueberzahlung", "required-document categories", "requested action",
      "stated deadline extraction and explanation", "safe next step", "authority and jurisdiction context",
    ],
    mustNotClaim: [
      "final benefit eligibility determination", "final amount calculation",
      "automatic legal objection strategy", "legal representation",
      "exact legal deadline without sufficient evidence", "guarantee that a document satisfies the authority",
    ],
    crossBorderPreparationRelevant: true,
  },
  {
    processGroupId: "familienkasse_kindergeld",
    title: "Familienkasse / Kindergeld",
    riskLevel: "high",
    distinguish: [],
    coverageItems: [
      "basic application orientation", "missing-document requests", "change-of-circumstance notices",
      "residence and employment relevance", "Familienkasse letters", "Rueckforderung",
      "actor responsibility distinction", "safe next step",
      "explicit preparation for the first DE<->SK cross-border pilot",
    ],
    mustNotClaim: [
      "final eligibility determination", "final priority-state determination",
      "foreign benefit coordination before EU/DE/SK evidence exists", "exact payment entitlement",
      "automatic assumption that the user must obtain every foreign document",
    ],
    crossBorderPreparationRelevant: true,
  },
  {
    processGroupId: "rechnung_mahnung",
    title: "Rechnung / Mahnung",
    riskLevel: "mixed",
    distinguish: ["Rechnung", "Zahlungserinnerung", "Mahnung", "Inkasso letter", "gerichtlicher Mahnbescheid"],
    coverageItems: [
      "sender", "claimed amount", "due date stated in document", "payment reference",
      "escalation signals", "dispute indicators", "safe next step",
      "warning when a court document may be involved",
    ],
    mustNotClaim: [
      "treat every Mahnung as a court order", "treat every due date as a statutory deadline",
      "confirm debt validity", "admit liability", "instruct payment without checking document context",
      "generate legal defence", "ignore a possible gerichtlicher Mahnbescheid",
    ],
    crossBorderPreparationRelevant: false,
  },
  {
    processGroupId: "kuendigung_orientation",
    title: "Kuendigung orientation",
    riskLevel: "high",
    distinguish: ["employment termination", "tenancy termination", "service-contract termination"],
    coverageItems: [
      "sender", "recipient", "stated termination date", "stated reason", "stated form",
      "document category", "possible urgency", "safe next step", "professional review warning where appropriate",
    ],
    mustNotClaim: [
      "determine legal validity", "determine unfair dismissal status", "determine tenancy-law validity",
      "calculate legal deadline without evidence", "generate definitive legal strategy", "represent the user",
    ],
    crossBorderPreparationRelevant: false,
  },
  {
    processGroupId: "auslaenderbehoerde_limited_orientation",
    title: "Auslaenderbehoerde limited orientation",
    riskLevel: "high",
    distinguish: [],
    coverageItems: [
      "authority identification", "appointment notice", "document request", "Mitwirkung request",
      "basic terminology", "Fiktionsbescheinigung terminology", "stated deadline explanation",
      "safe next step", "professional/legal help escalation",
    ],
    mustNotClaim: [
      "immigration-status determination", "residence-permit eligibility", "asylum advice",
      "deportation-risk assessment", "legal validity of status", "final interpretation of residence law",
      "official filing", "false reassurance",
    ],
    crossBorderPreparationRelevant: false,
  },
];

const EXPECTED_COVERAGE_COUNTS: Readonly<Record<ProcessGroupId, { coverage: number; mustNotClaim: number }>> = {
  anmeldung_ummeldung_abmeldung: { coverage: 11, mustNotClaim: 5 },
  steuer_id_and_basic_finanzamt_letters: { coverage: 9, mustNotClaim: 7 },
  health_insurance_orientation: { coverage: 10, mustNotClaim: 6 },
  jobcenter_buergergeld: { coverage: 14, mustNotClaim: 6 },
  familienkasse_kindergeld: { coverage: 9, mustNotClaim: 5 },
  rechnung_mahnung: { coverage: 8, mustNotClaim: 7 },
  kuendigung_orientation: { coverage: 9, mustNotClaim: 6 },
  auslaenderbehoerde_limited_orientation: { coverage: 9, mustNotClaim: 8 },
};

// ============================================================================
// PROCESS COVERAGE PLAN CONTRACT (31 fields, immutable design)
// ============================================================================

export interface ProcessCoveragePlan {
  processGroupId: ProcessGroupId;
  title: string;
  wave: 1 | 2 | 3;
  priority: number;
  pilotRequired: boolean;
  launchRequired: boolean;
  crossBorderPreparationRelevant: boolean;
  riskLevel: RiskLevel;
  orientationOnly: boolean;
  fullLegalAdviceExcluded: true;
  claimTypesRequired: readonly ClaimType[];
  sourceTypesRequired: readonly string[];
  authorityTypesRequired: readonly AuthorityCategory[];
  jurisdictionLevelsRequired: readonly string[];
  regionalVariationExpected: boolean;
  formsExpected: boolean;
  deadlineHandling: DeadlineHandlingLevel;
  feesExpected: FeePolicyState;
  requiredEvidenceCategories: readonly string[];
  safeNextStepsSupported: boolean;
  blockedOutputs: readonly string[];
  highRiskEscalations: readonly string[];
  minimumSourceCoverage: readonly string[];
  minimumClaimCoverage: readonly ClaimType[];
  minimumAuthorityCoverage: readonly AuthorityCategory[];
  minimumRegionalCoverage: RegionalCoverageState;
  minimumCitationCoverage: readonly string[];
  testingRequirements: readonly string[];
  openDependencies: readonly string[];
  deferredSubtopics: readonly string[];
  exitCriteria: readonly string[];
}

const PROCESS_COVERAGE_PLAN_FIELDS: readonly (keyof ProcessCoveragePlan)[] = [
  "processGroupId", "title", "wave", "priority", "pilotRequired", "launchRequired",
  "crossBorderPreparationRelevant", "riskLevel", "orientationOnly", "fullLegalAdviceExcluded",
  "claimTypesRequired", "sourceTypesRequired", "authorityTypesRequired", "jurisdictionLevelsRequired",
  "regionalVariationExpected", "formsExpected", "deadlineHandling", "feesExpected",
  "requiredEvidenceCategories", "safeNextStepsSupported", "blockedOutputs", "highRiskEscalations",
  "minimumSourceCoverage", "minimumClaimCoverage", "minimumAuthorityCoverage", "minimumRegionalCoverage",
  "minimumCitationCoverage", "testingRequirements", "openDependencies", "deferredSubtopics", "exitCriteria",
];

function waveOf(id: ProcessGroupId): 1 | 2 | 3 {
  if (WAVE_ONE_GROUPS.includes(id)) return 1;
  if (WAVE_TWO_GROUPS.includes(id)) return 2;
  return 3;
}

function buildProcessCoveragePlans(): readonly ProcessCoveragePlan[] {
  return PROCESS_TOPIC_SPECS.map((spec, index): ProcessCoveragePlan => {
    const testingRequirements = spec.crossBorderPreparationRelevant
      ? [...STANDARD_TESTING_REQUIREMENTS, ...CROSS_BORDER_TESTING_REQUIREMENTS]
      : STANDARD_TESTING_REQUIREMENTS;
    return {
      processGroupId: spec.processGroupId,
      title: spec.title,
      wave: waveOf(spec.processGroupId),
      priority: index + 1,
      pilotRequired: true,
      launchRequired: true,
      crossBorderPreparationRelevant: spec.crossBorderPreparationRelevant,
      riskLevel: spec.riskLevel,
      orientationOnly: true,
      fullLegalAdviceExcluded: true,
      claimTypesRequired: ["general_orientation", "safe_next_step", "documentary_fact", "responsible_actor_rule"],
      sourceTypesRequired: ["official_source", "authority_source"],
      authorityTypesRequired: AUTHORITY_CATEGORIES.filter((a) => processAuthorityRelevant(spec.processGroupId, a)),
      jurisdictionLevelsRequired: ["de_federal", "de_land", "de_gemeinde", "unresolved"],
      regionalVariationExpected: true,
      formsExpected: true,
      deadlineHandling: spec.processGroupId === "auslaenderbehoerde_limited_orientation" || spec.processGroupId === "kuendigung_orientation"
        ? "calculation_blocked"
        : "exact_calculation_authorized_only_with_evidence",
      feesExpected: "fee_requires_verification",
      requiredEvidenceCategories: [...SOURCE_COVERAGE_CATEGORIES],
      safeNextStepsSupported: true,
      blockedOutputs: [...BLOCKED_INITIAL_DEPTHS, ...spec.mustNotClaim],
      highRiskEscalations: spec.riskLevel === "high" || spec.riskLevel === "mixed" ? ["professional_or_legal_help_escalation"] : [],
      minimumSourceCoverage: [...SOURCE_COVERAGE_CATEGORIES],
      minimumClaimCoverage: ["general_orientation", "safe_next_step", "documentary_fact"],
      minimumAuthorityCoverage: AUTHORITY_CATEGORIES.filter((a) => processAuthorityRelevant(spec.processGroupId, a)),
      minimumRegionalCoverage: "pilot_region_ready",
      minimumCitationCoverage: ["original_german_citation", "version_and_effective_date_metadata"],
      testingRequirements,
      openDependencies: ["german_knowledge_source_population", "minimal_knowledge_storage_schema"],
      deferredSubtopics: [...spec.mustNotClaim],
      exitCriteria: [
        "explicit scope defined", "minimum source requirements defined", "authority requirements defined",
        "regional policy defined", "deadline policy defined", "blocked outputs defined", "testing requirements defined",
      ],
    };
  });
}

function processAuthorityRelevant(id: ProcessGroupId, category: AuthorityCategory): boolean {
  const map: Record<ProcessGroupId, readonly AuthorityCategory[]> = {
    anmeldung_ummeldung_abmeldung: ["registration_authority"],
    steuer_id_and_basic_finanzamt_letters: ["finanzamt"],
    health_insurance_orientation: ["health_insurance_body", "employer_related_authority"],
    jobcenter_buergergeld: ["jobcenter"],
    familienkasse_kindergeld: ["familienkasse"],
    rechnung_mahnung: ["court_or_mahnverfahren_authority"],
    kuendigung_orientation: ["employer_related_authority", "tenancy_related_public_information_authority", "court_or_mahnverfahren_authority"],
    auslaenderbehoerde_limited_orientation: ["auslaenderbehoerde"],
  };
  return map[id].includes(category);
}

// ─── Result shape ───────────────────────────────────────────────────────────

interface Result {
  checkId: "9D";
  allPassed: boolean;

  sourceClosureCommit: string;
  sourceArchitectureCheckId: string;
  sourceTrustContractCheckId: string;
  sourceJurisdictionModelCheckId: string;
  sourceArchitectureReady: boolean;
  sourceTrustContractReady: boolean;
  sourceJurisdictionModelReady: boolean;

  sourceInspectionOnly: boolean;
  runtimeModified: boolean;
  uiModified: boolean;
  routeModified: boolean;
  databaseMigrationCreated: boolean;
  databaseWritePerformed: boolean;
  networkAccessPerformed: boolean;
  externalSourceDownloaded: boolean;
  realSourceRegistered: boolean;
  realAuthorityRegistered: boolean;
  realProcessPopulated: boolean;
  realClaimPopulated: boolean;
  realCrossBorderConnectorImplemented: boolean;
  modelCallPerformed: boolean;
  ocrExecutionPerformed: boolean;
  embeddingCreated: boolean;
  retrievalPerformed: boolean;
  persistenceOfUserContentPerformed: boolean;

  initialProcessGroupCount: number;
  initialProcessGroupsDefined: boolean;
  wavePlanDefined: boolean;
  waveOneDefined: boolean;
  waveTwoDefined: boolean;
  waveThreeDefined: boolean;
  processCoverageContractDefined: boolean;
  riskLevelsDefined: boolean;
  processDepthLevelsDefined: boolean;

  anmeldungCoverageDefined: boolean;
  finanzamtCoverageDefined: boolean;
  healthInsuranceCoverageDefined: boolean;
  jobcenterCoverageDefined: boolean;
  familienkasseCoverageDefined: boolean;
  rechnungMahnungCoverageDefined: boolean;
  kuendigungCoverageDefined: boolean;
  auslaenderbehoerdeLimitedCoverageDefined: boolean;

  claimTypeCoverageMapped: boolean;
  sourceCoverageRequirementsDefined: boolean;
  authorityCoverageRequirementsDefined: boolean;
  regionalCoveragePolicyDefined: boolean;
  pilotRegionStrategyDefined: boolean;
  documentClassCoverageDefined: boolean;
  deadlinePolicyDefined: boolean;
  feePolicyDefined: boolean;
  responsibleActorPolicyDefined: boolean;
  testingRequirementsDefined: boolean;
  exitCriteriaDefined: boolean;
  deferredGermanScopeDefined: boolean;

  deSkPreparationDefined: boolean;
  deSkPriorityTopicsRecorded: boolean;
  deSkFirstPilotTopic: string;
  deSkConnectorNotImplemented: boolean;
  deSkActivationIndependentFromLocale: boolean;
  deSkRequiresEuGermanSlovakEvidence: boolean;
  deSkRequiresResponsibleActorResolution: boolean;
  deSkRequiresTemporalAlignment: boolean;

  fullLegalAdviceExcluded: boolean;
  finalEligibilityDeterminationBlocked: boolean;
  legalValidityDeterminationBlocked: boolean;
  officialSubmissionBlocked: boolean;
  legalRepresentationBlocked: boolean;
  exactDeadlineStillEvidenceGated: boolean;
  regionalGapsMustRemainVisible: boolean;
  pilotCoverageCannotBeGeneralizedNationally: boolean;

  zeroRealSourcesIngested: boolean;
  zeroRealAuthoritiesRegistered: boolean;
  zeroRealProcessesPopulated: boolean;
  zeroRealClaimsPopulated: boolean;
  zeroCrossBorderConnectorsImplemented: boolean;

  standaloneExtractionStillOpen: boolean;
  physicalAndroidStillUntested: boolean;
  genuineIosSafariStillUntested: boolean;
  heicHeifStillOpen: boolean;
  serverlessOcrStillOpen: boolean;
  distributedRateLimiterStillOpen: boolean;
  paymentFlowStillOpen: boolean;
  sixLanguageProductionParityStillOpen: boolean;
  germanKnowledgePopulationStillOpen: boolean;

  productionAuthorizedNow: boolean;
  publicRuntimeAuthorizedNow: boolean;
  publicBetaAuthorizedNow: boolean;
  goLiveAuthorizedNow: boolean;

  readyForMinimalKnowledgeStorageSchema: boolean;

  // Structural / provenance supplements
  existingFileModified: boolean;
  onlyExpectedFilesChanged: boolean;
  newAuditFileCreated: boolean;
  processGroupIds: readonly string[];
  waveOneGroups: readonly string[];
  waveTwoGroups: readonly string[];
  waveThreeGroups: readonly string[];

  // Supplementary forbidden-claim flags — every one must remain false; each
  // tamper case flips exactly one (or a required field above).
  moreThanEightProcessGroupsAddedAccepted: boolean;
  oneRequiredProcessGroupOmittedAccepted: boolean;
  waveOrderingChangedWithoutEvidenceAccepted: boolean;
  allTopicsForcedIntoWaveOneAccepted: boolean;
  auslaenderbehoerdeTreatedAsLowRiskAccepted: boolean;
  kuendigungTreatedAsLegalValidityDeterminationAccepted: boolean;
  taxScopeExpandedToFullTaxReturnAccepted: boolean;
  jobcenterScopeExpandedToFinalEligibilityAccepted: boolean;
  kindergeldScopeExpandedToFinalEntitlementAccepted: boolean;
  healthInsuranceScopeExpandedToMedicalAdviceAccepted: boolean;
  anmeldungScopeAssumesOneNationalProcedureAccepted: boolean;
  municipalitySpecificProcedureGeneralizedNationallyAccepted: boolean;
  registrationSuccessClaimedAccepted: boolean;
  steuerIdConfusedWithSteuernummerAccepted: boolean;
  taxLiabilityDeterminedAccepted: boolean;
  exactEinspruchDeadlineIssuedWithoutEvidenceAccepted: boolean;
  insuranceStatusFinallyDeterminedAccepted: boolean;
  contributionAmountCalculatedWithoutEvidenceAccepted: boolean;
  crossBorderInsuranceInstructionIssuedBeforeConnectorAccepted: boolean;
  buergergeldAmountFinallyCalculatedAccepted: boolean;
  legalObjectionStrategyGeneratedAccepted: boolean;
  userDocumentGuaranteedSufficientAccepted: boolean;
  kindergeldPriorityStateDeterminedWithoutEuEvidenceAccepted: boolean;
  foreignBenefitsCoordinatedWithoutForeignSourceAccepted: boolean;
  userAssumedResponsibleForEveryForeignDocumentAccepted: boolean;
  rechnungTreatedAsMahnungAccepted: boolean;
  mahnungTreatedAsCourtOrderAccepted: boolean;
  courtMahnbescheidTreatedAsOrdinaryReminderAccepted: boolean;
  debtValidityConfirmedAccepted: boolean;
  paymentInstructedWithoutContextAccepted: boolean;
  liabilityAdmittedAccepted: boolean;
  employmentKuendigungDeclaredInvalidAccepted: boolean;
  tenancyKuendigungDeclaredValidAccepted: boolean;
  definitiveLegalStrategyGeneratedAccepted: boolean;
  fiktionsbescheinigungTreatedAsStatusConfirmationAccepted: boolean;
  residenceEligibilityDeterminedAccepted: boolean;
  asylumAdviceIncludedAccepted: boolean;
  deportationRiskAssessedAccepted: boolean;
  exactImmigrationStatusConfirmedAccepted: boolean;
  legalRepresentationAuthorizedAccepted: boolean;
  officialFilingAuthorizedAccepted: boolean;
  statedDocumentDateConvertedAutomaticallyIntoStatutoryDeadlineAccepted: boolean;
  dueDateConvertedAutomaticallyIntoLegalDeadlineAccepted: boolean;
  courtDeadlineTreatedAsLowRiskAccepted: boolean;
  immigrationDeadlineTreatedAsLowRiskAccepted: boolean;
  appealDeadlineTreatedAsLowRiskAccepted: boolean;
  oneRiskLevelAssignedToEverySubtopicAccepted: boolean;
  processDepthIgnoresBlockedLevelsAccepted: boolean;
  allClaimTypesRequiredForEveryProcessAccepted: boolean;
  requiredClaimTypeMissingFromRelevantProcessAccepted: boolean;
  sourceRequirementOmittedAccepted: boolean;
  directPassageNotRequiredForHighRiskUseAccepted: boolean;
  competentAuthoritySourceOmittedAccepted: boolean;
  localSourceOmittedForLocalProcessAccepted: boolean;
  reviewStatusIgnoredAccepted: boolean;
  originalGermanCitationOmittedAccepted: boolean;
  authorityCategoryOmittedAccepted: boolean;
  nearbyAuthorityTreatedAsCompetentAccepted: boolean;
  nationwideMunicipalCoverageFalselyClaimedAccepted: boolean;
  pilotRegionOmittedDespiteLocalVariabilityAccepted: boolean;
  documentClassificationAuthorizesLegalConclusionAccepted: boolean;
  actorUnresolvedButConcreteInstructionIssuedAccepted: boolean;
  employerRoleIgnoredAccepted: boolean;
  insurerRoleIgnoredAccepted: boolean;
  authorityToAuthorityExchangeIgnoredAccepted: boolean;
  feeInferredFromStaleSourceAccepted: boolean;
  feeConflictIgnoredAccepted: boolean;
  deferredScopeTreatedAsLaunchScopeAccepted: boolean;
  completeImmigrationLawIncludedAccepted: boolean;
  fullEmploymentLawIncludedAccepted: boolean;
  fullTenancyLawIncludedAccepted: boolean;
  litigationIncludedAccepted: boolean;
  insolvencyIncludedAccepted: boolean;
  pensionLawIncludedAccepted: boolean;
  medicalAdviceIncludedAccepted: boolean;
  criminalLawIncludedAccepted: boolean;
  businessLicensingIncludedAccepted: boolean;
  germanLocaleDisablesDeSkCaseAccepted: boolean;
  deSkInstructionAllowedWithoutEuSourceAccepted: boolean;
  deSkInstructionAllowedWithoutGermanSourceAccepted: boolean;
  deSkInstructionAllowedWithoutSlovakSourceAccepted: boolean;
  competentAuthorityUnresolvedInDeSkCaseAccepted: boolean;
  crossBorderCitationsOmittedAccepted: boolean;
  familienkasseRemovedFromCrossBorderPriorityAccepted: boolean;
  healthInsuranceRemovedFromCrossBorderPreparationAccepted: boolean;
  unemploymentPeriodsRemovedFromPreparationAccepted: boolean;
  taxResidenceWorkFalselyMarkedImplementedAccepted: boolean;
  sourceContractTestOmittedAccepted: boolean;
  jurisdictionTestOmittedAccepted: boolean;
  effectiveDateTestOmittedAccepted: boolean;
  authorityCompetenceTestOmittedAccepted: boolean;
  citationTestOmittedAccepted: boolean;
  blockedOutputTestOmittedAccepted: boolean;
  localizationParityTestOmittedAccepted: boolean;
  noPersistenceTestOmittedAccepted: boolean;
  regressionTestOmittedAccepted: boolean;
  tamperTestOmittedAccepted: boolean;
  highRiskEscalationTestOmittedAccepted: boolean;
  crossBorderCompletenessTestOmittedAccepted: boolean;
  responsibleActorCrossBorderTestOmittedAccepted: boolean;
  temporalAlignmentTestOmittedAccepted: boolean;
  localeIndependentActivationTestOmittedAccepted: boolean;
  exitCriteriaPassWithMissingBlockedOutputsAccepted: boolean;
  exitCriteriaPassWithMissingRegionalPolicyAccepted: boolean;
  exitCriteriaPassWithMissingTestingRequirementsAccepted: boolean;
  germanKnowledgeClaimedPopulatedAccepted: boolean;
  sixLanguagesClaimedProductionReadyAccepted: boolean;
  anyTamperCaseSurvivedAccepted: boolean;

  tamperCaseCount: number;
  tamperCasesRejected: number;
  tamperCasesRejectedCount: number;

  waveOrderingRationale: Readonly<Record<string, string>>;
  waveOrderingRationaleFactors: readonly string[];
  claimTypes: readonly ClaimType[];
  sourceCoverageCategories: readonly string[];
  authorityCategories: readonly AuthorityCategory[];
  regionalCoverageStates: readonly RegionalCoverageState[];
  pilotRegionStrategyElements: readonly string[];
  documentClasses: readonly DocumentClass[];
  deadlineHandlingLevels: readonly DeadlineHandlingLevel[];
  feePolicyStates: readonly FeePolicyState[];
  responsibleActors: readonly ResponsibleActor[];
  standardTestingRequirements: readonly string[];
  crossBorderTestingRequirements: readonly string[];
  deferredGermanScope: readonly string[];
  deSkPreparationPriorityTopics: readonly string[];
  deSkPilotRequirements: readonly string[];
  processDepthLevels: readonly ProcessDepthLevel[];
  allowedInitialDepths: readonly ProcessDepthLevel[];
  restrictedInitialDepths: readonly ProcessDepthLevel[];
  blockedInitialDepths: readonly ProcessDepthLevel[];
  processCoveragePlans: readonly ProcessCoveragePlan[];
  knownOpenDebts: readonly string[];
  sourceEvidence: string[];
  notes: string[];
}

// ─── Tamper harness ─────────────────────────────────────────────────────────

type TamperCase = { id: number; description: string; mutate: (r: Result) => void };

function clone(r: Result): Result {
  return JSON.parse(JSON.stringify(r)) as Result;
}

const TAMPER_CASES: TamperCase[] = [
  { id: 1, description: "source closure commit changed", mutate: (r) => { r.sourceClosureCommit = "0000000"; } },
  { id: 2, description: "PHASE 9A missing", mutate: (r) => { r.sourceArchitectureCheckId = "missing"; } },
  { id: 3, description: "PHASE 9B missing", mutate: (r) => { r.sourceTrustContractCheckId = "missing"; } },
  { id: 4, description: "PHASE 9C missing", mutate: (r) => { r.sourceJurisdictionModelCheckId = "missing"; } },
  { id: 5, description: "source architecture not ready", mutate: (r) => { r.sourceArchitectureReady = false; } },
  { id: 6, description: "trust contract not ready", mutate: (r) => { r.sourceTrustContractReady = false; } },
  { id: 7, description: "jurisdiction model not ready", mutate: (r) => { r.sourceJurisdictionModelReady = false; } },
  { id: 8, description: "runtime modified", mutate: (r) => { r.runtimeModified = true; } },
  { id: 9, description: "UI modified", mutate: (r) => { r.uiModified = true; } },
  { id: 10, description: "route modified", mutate: (r) => { r.routeModified = true; } },
  { id: 11, description: "database migration created", mutate: (r) => { r.databaseMigrationCreated = true; } },
  { id: 12, description: "database write performed", mutate: (r) => { r.databaseWritePerformed = true; } },
  { id: 13, description: "network accessed", mutate: (r) => { r.networkAccessPerformed = true; } },
  { id: 14, description: "source downloaded", mutate: (r) => { r.externalSourceDownloaded = true; } },
  { id: 15, description: "source registered", mutate: (r) => { r.realSourceRegistered = true; } },
  { id: 16, description: "authority registered", mutate: (r) => { r.realAuthorityRegistered = true; } },
  { id: 17, description: "process populated", mutate: (r) => { r.realProcessPopulated = true; } },
  { id: 18, description: "claim populated", mutate: (r) => { r.realClaimPopulated = true; } },
  { id: 19, description: "cross-border connector implemented", mutate: (r) => { r.realCrossBorderConnectorImplemented = true; } },
  { id: 20, description: "model called", mutate: (r) => { r.modelCallPerformed = true; } },
  { id: 21, description: "OCR executed", mutate: (r) => { r.ocrExecutionPerformed = true; } },
  { id: 22, description: "embedding created", mutate: (r) => { r.embeddingCreated = true; } },
  { id: 23, description: "retrieval performed", mutate: (r) => { r.retrievalPerformed = true; } },
  { id: 24, description: "user content persisted", mutate: (r) => { r.persistenceOfUserContentPerformed = true; } },
  { id: 25, description: "more than eight initial process groups silently added", mutate: (r) => { r.processGroupIds = [...r.processGroupIds, "extra_group"]; r.moreThanEightProcessGroupsAddedAccepted = true; } },
  { id: 26, description: "one required process group omitted", mutate: (r) => { r.processGroupIds = r.processGroupIds.slice(0, 7); r.oneRequiredProcessGroupOmittedAccepted = true; } },
  { id: 27, description: "wave ordering changed without evidence", mutate: (r) => { r.waveOneGroups = ["kuendigung_orientation", "rechnung_mahnung", "health_insurance_orientation"]; r.waveOrderingChangedWithoutEvidenceAccepted = true; } },
  { id: 28, description: "all topics forced into Wave 1", mutate: (r) => { r.waveOneGroups = [...r.processGroupIds]; r.allTopicsForcedIntoWaveOneAccepted = true; } },
  { id: 29, description: "Auslaenderbehoerde treated as low risk", mutate: (r) => { r.auslaenderbehoerdeTreatedAsLowRiskAccepted = true; } },
  { id: 30, description: "Kuendigung treated as legal-validity determination", mutate: (r) => { r.kuendigungTreatedAsLegalValidityDeterminationAccepted = true; } },
  { id: 31, description: "tax scope expanded to full tax return", mutate: (r) => { r.taxScopeExpandedToFullTaxReturnAccepted = true; } },
  { id: 32, description: "Jobcenter scope expanded to final eligibility", mutate: (r) => { r.jobcenterScopeExpandedToFinalEligibilityAccepted = true; } },
  { id: 33, description: "Kindergeld scope expanded to final entitlement", mutate: (r) => { r.kindergeldScopeExpandedToFinalEntitlementAccepted = true; } },
  { id: 34, description: "health-insurance scope expanded to medical advice", mutate: (r) => { r.healthInsuranceScopeExpandedToMedicalAdviceAccepted = true; } },
  { id: 35, description: "Anmeldung scope assumes one national procedure", mutate: (r) => { r.anmeldungScopeAssumesOneNationalProcedureAccepted = true; } },
  { id: 36, description: "municipality-specific procedure generalized nationally", mutate: (r) => { r.municipalitySpecificProcedureGeneralizedNationallyAccepted = true; } },
  { id: 37, description: "registration success claimed", mutate: (r) => { r.registrationSuccessClaimedAccepted = true; } },
  { id: 38, description: "Steuer-ID confused with Steuernummer", mutate: (r) => { r.steuerIdConfusedWithSteuernummerAccepted = true; } },
  { id: 39, description: "tax liability determined", mutate: (r) => { r.taxLiabilityDeterminedAccepted = true; } },
  { id: 40, description: "exact Einspruch deadline issued without evidence", mutate: (r) => { r.exactEinspruchDeadlineIssuedWithoutEvidenceAccepted = true; } },
  { id: 41, description: "insurance status finally determined", mutate: (r) => { r.insuranceStatusFinallyDeterminedAccepted = true; } },
  { id: 42, description: "contribution amount calculated without evidence", mutate: (r) => { r.contributionAmountCalculatedWithoutEvidenceAccepted = true; } },
  { id: 43, description: "cross-border insurance instruction issued before connector", mutate: (r) => { r.crossBorderInsuranceInstructionIssuedBeforeConnectorAccepted = true; } },
  { id: 44, description: "Buergergeld amount finally calculated", mutate: (r) => { r.buergergeldAmountFinallyCalculatedAccepted = true; } },
  { id: 45, description: "legal objection strategy generated", mutate: (r) => { r.legalObjectionStrategyGeneratedAccepted = true; } },
  { id: 46, description: "user document guaranteed sufficient", mutate: (r) => { r.userDocumentGuaranteedSufficientAccepted = true; } },
  { id: 47, description: "Kindergeld priority state determined without EU evidence", mutate: (r) => { r.kindergeldPriorityStateDeterminedWithoutEuEvidenceAccepted = true; } },
  { id: 48, description: "foreign benefits coordinated without foreign source", mutate: (r) => { r.foreignBenefitsCoordinatedWithoutForeignSourceAccepted = true; } },
  { id: 49, description: "user assumed responsible for every foreign document", mutate: (r) => { r.userAssumedResponsibleForEveryForeignDocumentAccepted = true; } },
  { id: 50, description: "Rechnung treated as Mahnung", mutate: (r) => { r.rechnungTreatedAsMahnungAccepted = true; } },
  { id: 51, description: "Mahnung treated as court order", mutate: (r) => { r.mahnungTreatedAsCourtOrderAccepted = true; } },
  { id: 52, description: "court Mahnbescheid treated as ordinary reminder", mutate: (r) => { r.courtMahnbescheidTreatedAsOrdinaryReminderAccepted = true; } },
  { id: 53, description: "debt validity confirmed", mutate: (r) => { r.debtValidityConfirmedAccepted = true; } },
  { id: 54, description: "payment instructed without context", mutate: (r) => { r.paymentInstructedWithoutContextAccepted = true; } },
  { id: 55, description: "liability admitted", mutate: (r) => { r.liabilityAdmittedAccepted = true; } },
  { id: 56, description: "employment Kuendigung declared invalid", mutate: (r) => { r.employmentKuendigungDeclaredInvalidAccepted = true; } },
  { id: 57, description: "tenancy Kuendigung declared valid", mutate: (r) => { r.tenancyKuendigungDeclaredValidAccepted = true; } },
  { id: 58, description: "definitive legal strategy generated", mutate: (r) => { r.definitiveLegalStrategyGeneratedAccepted = true; } },
  { id: 59, description: "Fiktionsbescheinigung treated as status confirmation", mutate: (r) => { r.fiktionsbescheinigungTreatedAsStatusConfirmationAccepted = true; } },
  { id: 60, description: "residence eligibility determined", mutate: (r) => { r.residenceEligibilityDeterminedAccepted = true; } },
  { id: 61, description: "asylum advice included", mutate: (r) => { r.asylumAdviceIncludedAccepted = true; } },
  { id: 62, description: "deportation risk assessed", mutate: (r) => { r.deportationRiskAssessedAccepted = true; } },
  { id: 63, description: "exact immigration status confirmed", mutate: (r) => { r.exactImmigrationStatusConfirmedAccepted = true; } },
  { id: 64, description: "legal representation authorized", mutate: (r) => { r.legalRepresentationAuthorizedAccepted = true; r.legalRepresentationBlocked = false; } },
  { id: 65, description: "official filing authorized", mutate: (r) => { r.officialFilingAuthorizedAccepted = true; r.officialSubmissionBlocked = false; } },
  { id: 66, description: "final eligibility determination allowed", mutate: (r) => { r.finalEligibilityDeterminationBlocked = false; } },
  { id: 67, description: "legal validity determination allowed", mutate: (r) => { r.legalValidityDeterminationBlocked = false; } },
  { id: 68, description: "exact deadline ungated", mutate: (r) => { r.exactDeadlineStillEvidenceGated = false; } },
  { id: 69, description: "stated document date converted automatically into statutory deadline", mutate: (r) => { r.statedDocumentDateConvertedAutomaticallyIntoStatutoryDeadlineAccepted = true; } },
  { id: 70, description: "due date converted automatically into legal deadline", mutate: (r) => { r.dueDateConvertedAutomaticallyIntoLegalDeadlineAccepted = true; } },
  { id: 71, description: "court deadline treated as low risk", mutate: (r) => { r.courtDeadlineTreatedAsLowRiskAccepted = true; } },
  { id: 72, description: "immigration deadline treated as low risk", mutate: (r) => { r.immigrationDeadlineTreatedAsLowRiskAccepted = true; } },
  { id: 73, description: "appeal deadline treated as low risk", mutate: (r) => { r.appealDeadlineTreatedAsLowRiskAccepted = true; } },
  { id: 74, description: "one risk level assigned to every subtopic", mutate: (r) => { r.oneRiskLevelAssignedToEverySubtopicAccepted = true; } },
  { id: 75, description: "process depth ignores blocked levels", mutate: (r) => { r.processDepthIgnoresBlockedLevelsAccepted = true; } },
  { id: 76, description: "all claim types required for every process", mutate: (r) => { r.allClaimTypesRequiredForEveryProcessAccepted = true; } },
  { id: 77, description: "required claim type missing from relevant process", mutate: (r) => { r.requiredClaimTypeMissingFromRelevantProcessAccepted = true; } },
  { id: 78, description: "source requirement omitted", mutate: (r) => { r.sourceRequirementOmittedAccepted = true; } },
  { id: 79, description: "direct passage not required for high-risk use", mutate: (r) => { r.directPassageNotRequiredForHighRiskUseAccepted = true; } },
  { id: 80, description: "competent-authority source omitted", mutate: (r) => { r.competentAuthoritySourceOmittedAccepted = true; } },
  { id: 81, description: "local source omitted for local process", mutate: (r) => { r.localSourceOmittedForLocalProcessAccepted = true; } },
  { id: 82, description: "review status ignored", mutate: (r) => { r.reviewStatusIgnoredAccepted = true; } },
  { id: 83, description: "original German citation omitted", mutate: (r) => { r.originalGermanCitationOmittedAccepted = true; } },
  { id: 84, description: "authority category omitted", mutate: (r) => { r.authorityCategoryOmittedAccepted = true; } },
  { id: 85, description: "nearby authority treated as competent", mutate: (r) => { r.nearbyAuthorityTreatedAsCompetentAccepted = true; } },
  { id: 86, description: "regional gap hidden", mutate: (r) => { r.regionalGapsMustRemainVisible = false; } },
  { id: 87, description: "nationwide municipal coverage falsely claimed", mutate: (r) => { r.nationwideMunicipalCoverageFalselyClaimedAccepted = true; } },
  { id: 88, description: "pilot region generalized nationally", mutate: (r) => { r.pilotCoverageCannotBeGeneralizedNationally = false; } },
  { id: 89, description: "pilot region omitted despite local variability", mutate: (r) => { r.pilotRegionOmittedDespiteLocalVariabilityAccepted = true; } },
  { id: 90, description: "document classification authorizes legal conclusion", mutate: (r) => { r.documentClassificationAuthorizesLegalConclusionAccepted = true; } },
  { id: 91, description: "actor unresolved but concrete instruction issued", mutate: (r) => { r.actorUnresolvedButConcreteInstructionIssuedAccepted = true; } },
  { id: 92, description: "employer role ignored", mutate: (r) => { r.employerRoleIgnoredAccepted = true; } },
  { id: 93, description: "insurer role ignored", mutate: (r) => { r.insurerRoleIgnoredAccepted = true; } },
  { id: 94, description: "authority-to-authority exchange ignored", mutate: (r) => { r.authorityToAuthorityExchangeIgnoredAccepted = true; } },
  { id: 95, description: "fee inferred from stale source", mutate: (r) => { r.feeInferredFromStaleSourceAccepted = true; } },
  { id: 96, description: "fee conflict ignored", mutate: (r) => { r.feeConflictIgnoredAccepted = true; } },
  { id: 97, description: "deferred scope treated as launch scope", mutate: (r) => { r.deferredScopeTreatedAsLaunchScopeAccepted = true; } },
  { id: 98, description: "complete immigration law included", mutate: (r) => { r.completeImmigrationLawIncludedAccepted = true; } },
  { id: 99, description: "full employment law included", mutate: (r) => { r.fullEmploymentLawIncludedAccepted = true; } },
  { id: 100, description: "full tenancy law included", mutate: (r) => { r.fullTenancyLawIncludedAccepted = true; } },
  { id: 101, description: "litigation included", mutate: (r) => { r.litigationIncludedAccepted = true; } },
  { id: 102, description: "insolvency included", mutate: (r) => { r.insolvencyIncludedAccepted = true; } },
  { id: 103, description: "pension law included", mutate: (r) => { r.pensionLawIncludedAccepted = true; } },
  { id: 104, description: "medical advice included", mutate: (r) => { r.medicalAdviceIncludedAccepted = true; } },
  { id: 105, description: "criminal law included", mutate: (r) => { r.criminalLawIncludedAccepted = true; } },
  { id: 106, description: "business licensing included", mutate: (r) => { r.businessLicensingIncludedAccepted = true; } },
  { id: 107, description: "DE<->SK connector marked implemented", mutate: (r) => { r.deSkConnectorNotImplemented = false; } },
  { id: 108, description: "DE<->SK activated from Slovak locale", mutate: (r) => { r.deSkActivationIndependentFromLocale = false; } },
  { id: 109, description: "German locale disables DE<->SK case", mutate: (r) => { r.germanLocaleDisablesDeSkCaseAccepted = true; } },
  { id: 110, description: "first DE<->SK pilot topic changed silently", mutate: (r) => { r.deSkFirstPilotTopic = "jobcenter_buergergeld"; } },
  { id: 111, description: "DE<->SK instruction allowed without EU source", mutate: (r) => { r.deSkInstructionAllowedWithoutEuSourceAccepted = true; } },
  { id: 112, description: "DE<->SK instruction allowed without German source", mutate: (r) => { r.deSkInstructionAllowedWithoutGermanSourceAccepted = true; } },
  { id: 113, description: "DE<->SK instruction allowed without Slovak source", mutate: (r) => { r.deSkInstructionAllowedWithoutSlovakSourceAccepted = true; } },
  { id: 114, description: "responsible actor unresolved in DE<->SK case", mutate: (r) => { r.deSkRequiresResponsibleActorResolution = false; } },
  { id: 115, description: "temporal alignment missing in DE<->SK case", mutate: (r) => { r.deSkRequiresTemporalAlignment = false; } },
  { id: 116, description: "competent authority unresolved in DE<->SK case", mutate: (r) => { r.competentAuthorityUnresolvedInDeSkCaseAccepted = true; } },
  { id: 117, description: "cross-border citations omitted", mutate: (r) => { r.crossBorderCitationsOmittedAccepted = true; } },
  { id: 118, description: "Familienkasse removed from cross-border priority", mutate: (r) => { r.familienkasseRemovedFromCrossBorderPriorityAccepted = true; } },
  { id: 119, description: "health insurance removed from cross-border preparation", mutate: (r) => { r.healthInsuranceRemovedFromCrossBorderPreparationAccepted = true; } },
  { id: 120, description: "unemployment periods removed from preparation", mutate: (r) => { r.unemploymentPeriodsRemovedFromPreparationAccepted = true; } },
  { id: 121, description: "tax-residence work falsely marked implemented", mutate: (r) => { r.taxResidenceWorkFalselyMarkedImplementedAccepted = true; } },
  { id: 122, description: "source contract test omitted", mutate: (r) => { r.sourceContractTestOmittedAccepted = true; } },
  { id: 123, description: "jurisdiction test omitted", mutate: (r) => { r.jurisdictionTestOmittedAccepted = true; } },
  { id: 124, description: "effective-date test omitted", mutate: (r) => { r.effectiveDateTestOmittedAccepted = true; } },
  { id: 125, description: "authority competence test omitted", mutate: (r) => { r.authorityCompetenceTestOmittedAccepted = true; } },
  { id: 126, description: "citation test omitted", mutate: (r) => { r.citationTestOmittedAccepted = true; } },
  { id: 127, description: "blocked-output test omitted", mutate: (r) => { r.blockedOutputTestOmittedAccepted = true; } },
  { id: 128, description: "localization parity test omitted", mutate: (r) => { r.localizationParityTestOmittedAccepted = true; } },
  { id: 129, description: "no-persistence test omitted", mutate: (r) => { r.noPersistenceTestOmittedAccepted = true; } },
  { id: 130, description: "regression test omitted", mutate: (r) => { r.regressionTestOmittedAccepted = true; } },
  { id: 131, description: "tamper test omitted", mutate: (r) => { r.tamperTestOmittedAccepted = true; } },
  { id: 132, description: "high-risk escalation test omitted", mutate: (r) => { r.highRiskEscalationTestOmittedAccepted = true; } },
  { id: 133, description: "cross-border completeness test omitted", mutate: (r) => { r.crossBorderCompletenessTestOmittedAccepted = true; } },
  { id: 134, description: "responsible-actor cross-border test omitted", mutate: (r) => { r.responsibleActorCrossBorderTestOmittedAccepted = true; } },
  { id: 135, description: "temporal-alignment test omitted", mutate: (r) => { r.temporalAlignmentTestOmittedAccepted = true; } },
  { id: 136, description: "locale-independent activation test omitted", mutate: (r) => { r.localeIndependentActivationTestOmittedAccepted = true; } },
  { id: 137, description: "exit criteria pass with missing process scope", mutate: (r) => { r.exitCriteriaDefined = false; } },
  { id: 138, description: "exit criteria pass with missing blocked outputs", mutate: (r) => { r.exitCriteriaPassWithMissingBlockedOutputsAccepted = true; } },
  { id: 139, description: "exit criteria pass with missing regional policy", mutate: (r) => { r.exitCriteriaPassWithMissingRegionalPolicyAccepted = true; } },
  { id: 140, description: "exit criteria pass with missing testing requirements", mutate: (r) => { r.exitCriteriaPassWithMissingTestingRequirementsAccepted = true; } },
  { id: 141, description: "production authorized", mutate: (r) => { r.productionAuthorizedNow = true; } },
  { id: 142, description: "public runtime authorized", mutate: (r) => { r.publicRuntimeAuthorizedNow = true; } },
  { id: 143, description: "public beta authorized", mutate: (r) => { r.publicBetaAuthorizedNow = true; } },
  { id: 144, description: "go-live authorized", mutate: (r) => { r.goLiveAuthorizedNow = true; } },
  { id: 145, description: "German database claimed populated", mutate: (r) => { r.germanKnowledgeClaimedPopulatedAccepted = true; r.germanKnowledgePopulationStillOpen = false; } },
  { id: 146, description: "six languages claimed production-ready", mutate: (r) => { r.sixLanguagesClaimedProductionReadyAccepted = true; r.sixLanguageProductionParityStillOpen = false; } },
  { id: 147, description: "standalone extraction claimed complete", mutate: (r) => { r.standaloneExtractionStillOpen = false; } },
  { id: 148, description: "Android claimed tested", mutate: (r) => { r.physicalAndroidStillUntested = false; } },
  { id: 149, description: "iOS claimed tested", mutate: (r) => { r.genuineIosSafariStillUntested = false; } },
  { id: 150, description: "HEIC claimed complete", mutate: (r) => { r.heicHeifStillOpen = false; } },
  { id: 151, description: "serverless OCR claimed complete", mutate: (r) => { r.serverlessOcrStillOpen = false; } },
  { id: 152, description: "distributed limiter claimed complete", mutate: (r) => { r.distributedRateLimiterStillOpen = false; } },
  { id: 153, description: "payment flow claimed complete", mutate: (r) => { r.paymentFlowStillOpen = false; } },
  { id: 154, description: "audit passes with unexpected changed file", mutate: (r) => { r.onlyExpectedFilesChanged = false; r.existingFileModified = true; } },
  { id: 155, description: "audit passes if real data was populated", mutate: (r) => { r.zeroRealSourcesIngested = false; r.realSourceRegistered = true; } },
  { id: 156, description: "audit passes if any initial-scope safety boundary is weakened", mutate: (r) => { r.fullLegalAdviceExcluded = false; } },
  { id: 157, description: "audit passes if any DE<->SK boundary is weakened", mutate: (r) => { r.deSkRequiresEuGermanSlovakEvidence = false; } },
  { id: 158, description: "audit passes if any tamper case survives", mutate: (r) => { r.anyTamperCaseSurvivedAccepted = true; } },
  { id: 159, description: "checkId wrong", mutate: (r) => { (r as { checkId: string }).checkId = "9E"; } },
  { id: 160, description: "tamperCaseCount mismatched", mutate: (r) => { r.tamperCaseCount = 1; } },
];

function runTamperCases(good: Result): { total: number; rejected: number; failures: string[] } {
  let rejected = 0;
  const failures: string[] = [];
  for (const tc of TAMPER_CASES) {
    const mutated = clone(good);
    tc.mutate(mutated);
    const ok = computeExpectedAllPassed(mutated);
    if (ok === false) {
      rejected += 1;
    } else {
      failures.push(`#${tc.id} (${tc.description}) was NOT rejected`);
    }
  }
  return { total: TAMPER_CASES.length, rejected, failures };
}

function computeExpectedAllPassed(r: Result): boolean {
  const checks: boolean[] = [
    r.checkId === "9D",
    r.sourceClosureCommit === SOURCE_CLOSURE_COMMIT,
    r.sourceArchitectureCheckId === SOURCE_ARCHITECTURE_CHECK_ID,
    r.sourceTrustContractCheckId === SOURCE_TRUST_CONTRACT_CHECK_ID,
    r.sourceJurisdictionModelCheckId === SOURCE_JURISDICTION_MODEL_CHECK_ID,
    r.sourceArchitectureReady === true,
    r.sourceTrustContractReady === true,
    r.sourceJurisdictionModelReady === true,

    r.sourceInspectionOnly === true,
    r.runtimeModified === false,
    r.uiModified === false,
    r.routeModified === false,
    r.databaseMigrationCreated === false,
    r.databaseWritePerformed === false,
    r.networkAccessPerformed === false,
    r.externalSourceDownloaded === false,
    r.realSourceRegistered === false,
    r.realAuthorityRegistered === false,
    r.realProcessPopulated === false,
    r.realClaimPopulated === false,
    r.realCrossBorderConnectorImplemented === false,
    r.modelCallPerformed === false,
    r.ocrExecutionPerformed === false,
    r.embeddingCreated === false,
    r.retrievalPerformed === false,
    r.persistenceOfUserContentPerformed === false,

    r.initialProcessGroupCount === 8,
    r.processGroupIds.length === 8,
    r.initialProcessGroupsDefined === true,
    r.wavePlanDefined === true,
    r.waveOneDefined === true,
    r.waveTwoDefined === true,
    r.waveThreeDefined === true,
    r.waveOneGroups.length === 3 &&
      r.waveOneGroups[0] === "anmeldung_ummeldung_abmeldung" &&
      r.waveOneGroups[1] === "rechnung_mahnung" &&
      r.waveOneGroups[2] === "health_insurance_orientation",
    r.waveTwoGroups.length === 3,
    r.waveThreeGroups.length === 2,
    r.processCoverageContractDefined === true,
    r.riskLevelsDefined === true,
    r.processDepthLevelsDefined === true,

    r.anmeldungCoverageDefined === true,
    r.finanzamtCoverageDefined === true,
    r.healthInsuranceCoverageDefined === true,
    r.jobcenterCoverageDefined === true,
    r.familienkasseCoverageDefined === true,
    r.rechnungMahnungCoverageDefined === true,
    r.kuendigungCoverageDefined === true,
    r.auslaenderbehoerdeLimitedCoverageDefined === true,

    r.claimTypeCoverageMapped === true,
    r.sourceCoverageRequirementsDefined === true,
    r.authorityCoverageRequirementsDefined === true,
    r.regionalCoveragePolicyDefined === true,
    r.pilotRegionStrategyDefined === true,
    r.documentClassCoverageDefined === true,
    r.deadlinePolicyDefined === true,
    r.feePolicyDefined === true,
    r.responsibleActorPolicyDefined === true,
    r.testingRequirementsDefined === true,
    r.exitCriteriaDefined === true,
    r.deferredGermanScopeDefined === true,

    r.deSkPreparationDefined === true,
    r.deSkPriorityTopicsRecorded === true,
    r.deSkFirstPilotTopic === "familienkasse_kindergeld",
    r.deSkConnectorNotImplemented === true,
    r.deSkActivationIndependentFromLocale === true,
    r.deSkRequiresEuGermanSlovakEvidence === true,
    r.deSkRequiresResponsibleActorResolution === true,
    r.deSkRequiresTemporalAlignment === true,

    r.fullLegalAdviceExcluded === true,
    r.finalEligibilityDeterminationBlocked === true,
    r.legalValidityDeterminationBlocked === true,
    r.officialSubmissionBlocked === true,
    r.legalRepresentationBlocked === true,
    r.exactDeadlineStillEvidenceGated === true,
    r.regionalGapsMustRemainVisible === true,
    r.pilotCoverageCannotBeGeneralizedNationally === true,

    r.zeroRealSourcesIngested === true,
    r.zeroRealAuthoritiesRegistered === true,
    r.zeroRealProcessesPopulated === true,
    r.zeroRealClaimsPopulated === true,
    r.zeroCrossBorderConnectorsImplemented === true,

    r.standaloneExtractionStillOpen === true,
    r.physicalAndroidStillUntested === true,
    r.genuineIosSafariStillUntested === true,
    r.heicHeifStillOpen === true,
    r.serverlessOcrStillOpen === true,
    r.distributedRateLimiterStillOpen === true,
    r.paymentFlowStillOpen === true,
    r.sixLanguageProductionParityStillOpen === true,
    r.germanKnowledgePopulationStillOpen === true,

    r.productionAuthorizedNow === false,
    r.publicRuntimeAuthorizedNow === false,
    r.publicBetaAuthorizedNow === false,
    r.goLiveAuthorizedNow === false,

    r.existingFileModified === false,
    r.onlyExpectedFilesChanged === true,
    r.newAuditFileCreated === true,

    r.moreThanEightProcessGroupsAddedAccepted === false,
    r.oneRequiredProcessGroupOmittedAccepted === false,
    r.waveOrderingChangedWithoutEvidenceAccepted === false,
    r.allTopicsForcedIntoWaveOneAccepted === false,
    r.auslaenderbehoerdeTreatedAsLowRiskAccepted === false,
    r.kuendigungTreatedAsLegalValidityDeterminationAccepted === false,
    r.taxScopeExpandedToFullTaxReturnAccepted === false,
    r.jobcenterScopeExpandedToFinalEligibilityAccepted === false,
    r.kindergeldScopeExpandedToFinalEntitlementAccepted === false,
    r.healthInsuranceScopeExpandedToMedicalAdviceAccepted === false,
    r.anmeldungScopeAssumesOneNationalProcedureAccepted === false,
    r.municipalitySpecificProcedureGeneralizedNationallyAccepted === false,
    r.registrationSuccessClaimedAccepted === false,
    r.steuerIdConfusedWithSteuernummerAccepted === false,
    r.taxLiabilityDeterminedAccepted === false,
    r.exactEinspruchDeadlineIssuedWithoutEvidenceAccepted === false,
    r.insuranceStatusFinallyDeterminedAccepted === false,
    r.contributionAmountCalculatedWithoutEvidenceAccepted === false,
    r.crossBorderInsuranceInstructionIssuedBeforeConnectorAccepted === false,
    r.buergergeldAmountFinallyCalculatedAccepted === false,
    r.legalObjectionStrategyGeneratedAccepted === false,
    r.userDocumentGuaranteedSufficientAccepted === false,
    r.kindergeldPriorityStateDeterminedWithoutEuEvidenceAccepted === false,
    r.foreignBenefitsCoordinatedWithoutForeignSourceAccepted === false,
    r.userAssumedResponsibleForEveryForeignDocumentAccepted === false,
    r.rechnungTreatedAsMahnungAccepted === false,
    r.mahnungTreatedAsCourtOrderAccepted === false,
    r.courtMahnbescheidTreatedAsOrdinaryReminderAccepted === false,
    r.debtValidityConfirmedAccepted === false,
    r.paymentInstructedWithoutContextAccepted === false,
    r.liabilityAdmittedAccepted === false,
    r.employmentKuendigungDeclaredInvalidAccepted === false,
    r.tenancyKuendigungDeclaredValidAccepted === false,
    r.definitiveLegalStrategyGeneratedAccepted === false,
    r.fiktionsbescheinigungTreatedAsStatusConfirmationAccepted === false,
    r.residenceEligibilityDeterminedAccepted === false,
    r.asylumAdviceIncludedAccepted === false,
    r.deportationRiskAssessedAccepted === false,
    r.exactImmigrationStatusConfirmedAccepted === false,
    r.legalRepresentationAuthorizedAccepted === false,
    r.officialFilingAuthorizedAccepted === false,
    r.statedDocumentDateConvertedAutomaticallyIntoStatutoryDeadlineAccepted === false,
    r.dueDateConvertedAutomaticallyIntoLegalDeadlineAccepted === false,
    r.courtDeadlineTreatedAsLowRiskAccepted === false,
    r.immigrationDeadlineTreatedAsLowRiskAccepted === false,
    r.appealDeadlineTreatedAsLowRiskAccepted === false,
    r.oneRiskLevelAssignedToEverySubtopicAccepted === false,
    r.processDepthIgnoresBlockedLevelsAccepted === false,
    r.allClaimTypesRequiredForEveryProcessAccepted === false,
    r.requiredClaimTypeMissingFromRelevantProcessAccepted === false,
    r.sourceRequirementOmittedAccepted === false,
    r.directPassageNotRequiredForHighRiskUseAccepted === false,
    r.competentAuthoritySourceOmittedAccepted === false,
    r.localSourceOmittedForLocalProcessAccepted === false,
    r.reviewStatusIgnoredAccepted === false,
    r.originalGermanCitationOmittedAccepted === false,
    r.authorityCategoryOmittedAccepted === false,
    r.nearbyAuthorityTreatedAsCompetentAccepted === false,
    r.nationwideMunicipalCoverageFalselyClaimedAccepted === false,
    r.pilotRegionOmittedDespiteLocalVariabilityAccepted === false,
    r.documentClassificationAuthorizesLegalConclusionAccepted === false,
    r.actorUnresolvedButConcreteInstructionIssuedAccepted === false,
    r.employerRoleIgnoredAccepted === false,
    r.insurerRoleIgnoredAccepted === false,
    r.authorityToAuthorityExchangeIgnoredAccepted === false,
    r.feeInferredFromStaleSourceAccepted === false,
    r.feeConflictIgnoredAccepted === false,
    r.deferredScopeTreatedAsLaunchScopeAccepted === false,
    r.completeImmigrationLawIncludedAccepted === false,
    r.fullEmploymentLawIncludedAccepted === false,
    r.fullTenancyLawIncludedAccepted === false,
    r.litigationIncludedAccepted === false,
    r.insolvencyIncludedAccepted === false,
    r.pensionLawIncludedAccepted === false,
    r.medicalAdviceIncludedAccepted === false,
    r.criminalLawIncludedAccepted === false,
    r.businessLicensingIncludedAccepted === false,
    r.germanLocaleDisablesDeSkCaseAccepted === false,
    r.deSkInstructionAllowedWithoutEuSourceAccepted === false,
    r.deSkInstructionAllowedWithoutGermanSourceAccepted === false,
    r.deSkInstructionAllowedWithoutSlovakSourceAccepted === false,
    r.competentAuthorityUnresolvedInDeSkCaseAccepted === false,
    r.crossBorderCitationsOmittedAccepted === false,
    r.familienkasseRemovedFromCrossBorderPriorityAccepted === false,
    r.healthInsuranceRemovedFromCrossBorderPreparationAccepted === false,
    r.unemploymentPeriodsRemovedFromPreparationAccepted === false,
    r.taxResidenceWorkFalselyMarkedImplementedAccepted === false,
    r.sourceContractTestOmittedAccepted === false,
    r.jurisdictionTestOmittedAccepted === false,
    r.effectiveDateTestOmittedAccepted === false,
    r.authorityCompetenceTestOmittedAccepted === false,
    r.citationTestOmittedAccepted === false,
    r.blockedOutputTestOmittedAccepted === false,
    r.localizationParityTestOmittedAccepted === false,
    r.noPersistenceTestOmittedAccepted === false,
    r.regressionTestOmittedAccepted === false,
    r.tamperTestOmittedAccepted === false,
    r.highRiskEscalationTestOmittedAccepted === false,
    r.crossBorderCompletenessTestOmittedAccepted === false,
    r.responsibleActorCrossBorderTestOmittedAccepted === false,
    r.temporalAlignmentTestOmittedAccepted === false,
    r.localeIndependentActivationTestOmittedAccepted === false,
    r.exitCriteriaPassWithMissingBlockedOutputsAccepted === false,
    r.exitCriteriaPassWithMissingRegionalPolicyAccepted === false,
    r.exitCriteriaPassWithMissingTestingRequirementsAccepted === false,
    r.germanKnowledgeClaimedPopulatedAccepted === false,
    r.sixLanguagesClaimedProductionReadyAccepted === false,
    r.anyTamperCaseSurvivedAccepted === false,

    r.tamperCaseCount === TAMPER_CASES.length,
    r.tamperCasesRejectedCount <= r.tamperCaseCount,
    r.tamperCasesRejected <= r.tamperCaseCount,
  ];
  return checks.every(Boolean);
}

// ─── Evidence collection (static source inspection + read-only git) ───────

type Evidence = {
  onlyExpectedFilesChanged: boolean;
  existingFileModified: boolean;
  newAuditFileCreated: boolean;
  sourceArchitectureCheckIdFound: string;
  sourceArchitectureReady: boolean;
  sourceTrustContractCheckIdFound: string;
  sourceTrustContractReady: boolean;
  sourceJurisdictionModelCheckIdFound: string;
  sourceJurisdictionModelReady: boolean;
  standaloneExtractionStillOpen: boolean;
  physicalAndroidStillUntested: boolean;
  genuineIosSafariStillUntested: boolean;
  heicHeifStillOpen: boolean;
  serverlessOcrStillOpen: boolean;
  distributedRateLimiterStillOpen: boolean;
  paymentFlowStillOpen: boolean;
  notes: string[];
};

function collectEvidence(): Evidence {
  const notes: string[] = [];

  const diffNameOnly = runGitReadOnly("git diff --name-only")
    .split("\n").map((s) => s.trim()).filter(Boolean);
  const statusShort = runGitReadOnly("git status --short")
    .split("\n").map((s) => s.trim()).filter(Boolean);
  const untrackedNew = statusShort
    .filter((line) => line.startsWith("??"))
    .map((line) => line.replace(/^\?\?\s*/, "").replace(/\\/g, "/"))
    .filter((p) => !p.startsWith(".next"));

  const isAuditPathOrDirCovering = (p: string): boolean => {
    if (p === AUDIT_SELF_REL_PATH || p.endsWith(AUDIT_SELF_REL_PATH)) return true;
    const dirPrefix = p.endsWith("/") ? p : `${p}/`;
    return AUDIT_SELF_REL_PATH.startsWith(dirPrefix);
  };

  const unexpectedModified = diffNameOnly.filter((p) => p !== AUDIT_SELF_REL_PATH);
  const newAuditFileCreated = fileExists(AUDIT_SELF_REL_PATH) && untrackedNew.some((p) => isAuditPathOrDirCovering(p));
  const unexpectedUntracked = untrackedNew.filter((p) => !isAuditPathOrDirCovering(p));

  const onlyExpectedFilesChanged = unexpectedModified.length === 0 && unexpectedUntracked.length === 0;
  const existingFileModified = diffNameOnly.length > 0;

  if (unexpectedModified.length > 0) notes.push(`Unexpected modified files: ${unexpectedModified.join(", ")}`);
  if (unexpectedUntracked.length > 0) notes.push(`Unexpected untracked files: ${unexpectedUntracked.join(", ")}`);

  const phase9aSrc = readFileText(PHASE_9A_REL_PATH);
  const phase9aExists = fileExists(PHASE_9A_REL_PATH);
  const checkId9aMatch = phase9aSrc.match(/checkId:\s*"([^"]+)";/);
  const sourceArchitectureCheckIdFound = checkId9aMatch ? checkId9aMatch[1] : "not_found";
  const sourceArchitectureReady =
    phase9aExists && sourceArchitectureCheckIdFound === "9A" &&
    phase9aSrc.includes("readyForGermanSourceHierarchyAndTrustContract: allPassed");
  if (!sourceArchitectureReady) notes.push("PHASE 9A source did not statically confirm readiness.");

  const phase9bSrc = readFileText(PHASE_9B_REL_PATH);
  const phase9bExists = fileExists(PHASE_9B_REL_PATH);
  const checkId9bMatch = phase9bSrc.match(/checkId:\s*"([^"]+)";/);
  const sourceTrustContractCheckIdFound = checkId9bMatch ? checkId9bMatch[1] : "not_found";
  const sourceTrustContractReady =
    phase9bExists && sourceTrustContractCheckIdFound === "9B" &&
    phase9bSrc.includes("readyForGermanJurisdictionEffectiveDateModel: allPassed");
  if (!sourceTrustContractReady) notes.push("PHASE 9B source did not statically confirm readiness.");

  const phase9cSrc = readFileText(PHASE_9C_REL_PATH);
  const phase9cExists = fileExists(PHASE_9C_REL_PATH);
  const checkId9cMatch = phase9cSrc.match(/checkId:\s*"([^"]+)";/);
  const sourceJurisdictionModelCheckIdFound = checkId9cMatch ? checkId9cMatch[1] : "not_found";
  const sourceJurisdictionModelReady =
    phase9cExists && sourceJurisdictionModelCheckIdFound === "9C" &&
    phase9cSrc.includes("readyForMinimumGermanProcessCoveragePlan: allPassed");
  if (!sourceJurisdictionModelReady) notes.push("PHASE 9C source did not statically confirm readiness.");

  const closureSrc = readFileText(CLOSURE_8_13C_REL_PATH);
  const closureExists = fileExists(CLOSURE_8_13C_REL_PATH);
  const standaloneExtractionStillOpen = phase9aExists && phase9aSrc.includes("standaloneSmartTalkExtractionRequiredLater: true");
  const physicalAndroidStillUntested = closureExists && closureSrc.includes("physicalAndroidStillUntested: true");
  const genuineIosSafariStillUntested = closureExists && closureSrc.includes("genuineIosSafariStillUntested: true");
  const heicHeifStillOpen = closureExists && closureSrc.includes("heicHeifStillOpen: !evidence.heicSupportImplementedNow");
  const serverlessOcrStillOpen = closureExists && closureSrc.includes("serverlessOcrValidationStillOpen: true");
  const distributedRateLimiterStillOpen =
    closureExists && closureSrc.includes("distributedRateLimiterStillOpen: !evidence.rateLimiterDistributedProductionSolved");
  const paymentFlowStillOpen = closureExists && closureSrc.includes("Final production payment flow");

  return {
    onlyExpectedFilesChanged, existingFileModified, newAuditFileCreated,
    sourceArchitectureCheckIdFound, sourceArchitectureReady,
    sourceTrustContractCheckIdFound, sourceTrustContractReady,
    sourceJurisdictionModelCheckIdFound, sourceJurisdictionModelReady,
    standaloneExtractionStillOpen, physicalAndroidStillUntested, genuineIosSafariStillUntested,
    heicHeifStillOpen, serverlessOcrStillOpen, distributedRateLimiterStillOpen, paymentFlowStillOpen,
    notes,
  };
}

// ─── Good-result construction ───────────────────────────────────────────────

function coverageDefinedFor(id: ProcessGroupId): boolean {
  const spec = PROCESS_TOPIC_SPECS.find((s) => s.processGroupId === id);
  const expected = EXPECTED_COVERAGE_COUNTS[id];
  if (!spec) return false;
  return spec.coverageItems.length === expected.coverage && spec.mustNotClaim.length === expected.mustNotClaim;
}

function buildGoodResult(evidence: Evidence): Result {
  const plans = buildProcessCoveragePlans();

  const designComplete =
    INITIAL_PROCESS_GROUPS.length === 8 &&
    WAVE_ONE_GROUPS.length === 3 && WAVE_TWO_GROUPS.length === 3 && WAVE_THREE_GROUPS.length === 2 &&
    RISK_LEVELS.length === 4 &&
    PROCESS_DEPTH_LEVELS.length === 11 &&
    ALLOWED_INITIAL_DEPTHS.length === 6 &&
    RESTRICTED_INITIAL_DEPTHS.length === 1 &&
    BLOCKED_INITIAL_DEPTHS.length === 4 &&
    CLAIM_TYPES.length === 14 &&
    SOURCE_COVERAGE_CATEGORIES.length === 8 &&
    AUTHORITY_CATEGORIES.length === 9 &&
    REGIONAL_COVERAGE_STATES.length === 6 &&
    PILOT_REGION_STRATEGY_ELEMENTS.length === 4 &&
    PILOT_CITY_SELECTED_THIS_PHASE === false &&
    DOCUMENT_CLASSES.length === 12 &&
    DOCUMENT_CLASSIFICATION_AUTHORIZES_LEGAL_CONCLUSION === false &&
    DEADLINE_HANDLING_LEVELS.length === 5 &&
    FEE_POLICY_STATES.length === 8 &&
    FEE_INFERRED_FROM_STALE_SOURCE_ALLOWED === false &&
    RESPONSIBLE_ACTORS.length === 10 &&
    CONCRETE_INSTRUCTION_ALLOWED_WITH_UNRESOLVED_ACTOR === false &&
    STANDARD_TESTING_REQUIREMENTS.length === 12 &&
    CROSS_BORDER_TESTING_REQUIREMENTS.length === 4 &&
    DEFERRED_GERMAN_SCOPE.length === 15 &&
    DE_SK_PREPARATION_PRIORITY_TOPICS.length === 4 &&
    DE_SK_FIRST_PILOT_TOPIC === "familienkasse_kindergeld" &&
    DE_SK_PILOT_REQUIREMENTS.length === 7 &&
    DE_SK_CONNECTOR_IMPLEMENTED_THIS_PHASE === false &&
    DE_SK_ACTIVATED_FROM_OUTPUT_LOCALE === false &&
    PROCESS_TOPIC_SPECS.length === 8 &&
    PROCESS_COVERAGE_PLAN_FIELDS.length === 31 &&
    plans.length === 8 &&
    INITIAL_PROCESS_GROUPS.every((id) => coverageDefinedFor(id)) &&
    WAVE_ORDERING_RATIONALE_FACTORS.length === 9 &&
    LAUNCH_LOCALES.length === 6;

  const allPassed =
    designComplete &&
    evidence.onlyExpectedFilesChanged &&
    !evidence.existingFileModified &&
    evidence.newAuditFileCreated &&
    evidence.sourceArchitectureReady &&
    evidence.sourceTrustContractReady &&
    evidence.sourceJurisdictionModelReady;

  return {
    checkId: "9D",
    allPassed,

    sourceClosureCommit: SOURCE_CLOSURE_COMMIT,
    sourceArchitectureCheckId: evidence.sourceArchitectureCheckIdFound,
    sourceTrustContractCheckId: evidence.sourceTrustContractCheckIdFound,
    sourceJurisdictionModelCheckId: evidence.sourceJurisdictionModelCheckIdFound,
    sourceArchitectureReady: evidence.sourceArchitectureReady,
    sourceTrustContractReady: evidence.sourceTrustContractReady,
    sourceJurisdictionModelReady: evidence.sourceJurisdictionModelReady,

    sourceInspectionOnly: true,
    runtimeModified: false,
    uiModified: false,
    routeModified: false,
    databaseMigrationCreated: false,
    databaseWritePerformed: false,
    networkAccessPerformed: false,
    externalSourceDownloaded: false,
    realSourceRegistered: false,
    realAuthorityRegistered: false,
    realProcessPopulated: false,
    realClaimPopulated: false,
    realCrossBorderConnectorImplemented: false,
    modelCallPerformed: false,
    ocrExecutionPerformed: false,
    embeddingCreated: false,
    retrievalPerformed: false,
    persistenceOfUserContentPerformed: false,

    initialProcessGroupCount: INITIAL_PROCESS_GROUPS.length,
    initialProcessGroupsDefined: true,
    wavePlanDefined: true,
    waveOneDefined: true,
    waveTwoDefined: true,
    waveThreeDefined: true,
    processCoverageContractDefined: true,
    riskLevelsDefined: true,
    processDepthLevelsDefined: true,

    anmeldungCoverageDefined: coverageDefinedFor("anmeldung_ummeldung_abmeldung"),
    finanzamtCoverageDefined: coverageDefinedFor("steuer_id_and_basic_finanzamt_letters"),
    healthInsuranceCoverageDefined: coverageDefinedFor("health_insurance_orientation"),
    jobcenterCoverageDefined: coverageDefinedFor("jobcenter_buergergeld"),
    familienkasseCoverageDefined: coverageDefinedFor("familienkasse_kindergeld"),
    rechnungMahnungCoverageDefined: coverageDefinedFor("rechnung_mahnung"),
    kuendigungCoverageDefined: coverageDefinedFor("kuendigung_orientation"),
    auslaenderbehoerdeLimitedCoverageDefined: coverageDefinedFor("auslaenderbehoerde_limited_orientation"),

    claimTypeCoverageMapped: true,
    sourceCoverageRequirementsDefined: true,
    authorityCoverageRequirementsDefined: true,
    regionalCoveragePolicyDefined: true,
    pilotRegionStrategyDefined: true,
    documentClassCoverageDefined: true,
    deadlinePolicyDefined: true,
    feePolicyDefined: true,
    responsibleActorPolicyDefined: true,
    testingRequirementsDefined: true,
    exitCriteriaDefined: true,
    deferredGermanScopeDefined: true,

    deSkPreparationDefined: true,
    deSkPriorityTopicsRecorded: true,
    deSkFirstPilotTopic: DE_SK_FIRST_PILOT_TOPIC,
    deSkConnectorNotImplemented: true,
    deSkActivationIndependentFromLocale: true,
    deSkRequiresEuGermanSlovakEvidence: true,
    deSkRequiresResponsibleActorResolution: true,
    deSkRequiresTemporalAlignment: true,

    fullLegalAdviceExcluded: true,
    finalEligibilityDeterminationBlocked: true,
    legalValidityDeterminationBlocked: true,
    officialSubmissionBlocked: true,
    legalRepresentationBlocked: true,
    exactDeadlineStillEvidenceGated: true,
    regionalGapsMustRemainVisible: true,
    pilotCoverageCannotBeGeneralizedNationally: true,

    zeroRealSourcesIngested: true,
    zeroRealAuthoritiesRegistered: true,
    zeroRealProcessesPopulated: true,
    zeroRealClaimsPopulated: true,
    zeroCrossBorderConnectorsImplemented: true,

    standaloneExtractionStillOpen: evidence.standaloneExtractionStillOpen,
    physicalAndroidStillUntested: evidence.physicalAndroidStillUntested,
    genuineIosSafariStillUntested: evidence.genuineIosSafariStillUntested,
    heicHeifStillOpen: evidence.heicHeifStillOpen,
    serverlessOcrStillOpen: evidence.serverlessOcrStillOpen,
    distributedRateLimiterStillOpen: evidence.distributedRateLimiterStillOpen,
    paymentFlowStillOpen: evidence.paymentFlowStillOpen,
    sixLanguageProductionParityStillOpen: true,
    germanKnowledgePopulationStillOpen: true,

    productionAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    publicBetaAuthorizedNow: false,
    goLiveAuthorizedNow: false,

    readyForMinimalKnowledgeStorageSchema: allPassed,

    existingFileModified: evidence.existingFileModified,
    onlyExpectedFilesChanged: evidence.onlyExpectedFilesChanged,
    newAuditFileCreated: evidence.newAuditFileCreated,
    processGroupIds: INITIAL_PROCESS_GROUPS,
    waveOneGroups: WAVE_ONE_GROUPS,
    waveTwoGroups: WAVE_TWO_GROUPS,
    waveThreeGroups: WAVE_THREE_GROUPS,

    moreThanEightProcessGroupsAddedAccepted: false,
    oneRequiredProcessGroupOmittedAccepted: false,
    waveOrderingChangedWithoutEvidenceAccepted: false,
    allTopicsForcedIntoWaveOneAccepted: false,
    auslaenderbehoerdeTreatedAsLowRiskAccepted: false,
    kuendigungTreatedAsLegalValidityDeterminationAccepted: false,
    taxScopeExpandedToFullTaxReturnAccepted: false,
    jobcenterScopeExpandedToFinalEligibilityAccepted: false,
    kindergeldScopeExpandedToFinalEntitlementAccepted: false,
    healthInsuranceScopeExpandedToMedicalAdviceAccepted: false,
    anmeldungScopeAssumesOneNationalProcedureAccepted: false,
    municipalitySpecificProcedureGeneralizedNationallyAccepted: false,
    registrationSuccessClaimedAccepted: false,
    steuerIdConfusedWithSteuernummerAccepted: false,
    taxLiabilityDeterminedAccepted: false,
    exactEinspruchDeadlineIssuedWithoutEvidenceAccepted: false,
    insuranceStatusFinallyDeterminedAccepted: false,
    contributionAmountCalculatedWithoutEvidenceAccepted: false,
    crossBorderInsuranceInstructionIssuedBeforeConnectorAccepted: false,
    buergergeldAmountFinallyCalculatedAccepted: false,
    legalObjectionStrategyGeneratedAccepted: false,
    userDocumentGuaranteedSufficientAccepted: false,
    kindergeldPriorityStateDeterminedWithoutEuEvidenceAccepted: false,
    foreignBenefitsCoordinatedWithoutForeignSourceAccepted: false,
    userAssumedResponsibleForEveryForeignDocumentAccepted: false,
    rechnungTreatedAsMahnungAccepted: false,
    mahnungTreatedAsCourtOrderAccepted: false,
    courtMahnbescheidTreatedAsOrdinaryReminderAccepted: false,
    debtValidityConfirmedAccepted: false,
    paymentInstructedWithoutContextAccepted: false,
    liabilityAdmittedAccepted: false,
    employmentKuendigungDeclaredInvalidAccepted: false,
    tenancyKuendigungDeclaredValidAccepted: false,
    definitiveLegalStrategyGeneratedAccepted: false,
    fiktionsbescheinigungTreatedAsStatusConfirmationAccepted: false,
    residenceEligibilityDeterminedAccepted: false,
    asylumAdviceIncludedAccepted: false,
    deportationRiskAssessedAccepted: false,
    exactImmigrationStatusConfirmedAccepted: false,
    legalRepresentationAuthorizedAccepted: false,
    officialFilingAuthorizedAccepted: false,
    statedDocumentDateConvertedAutomaticallyIntoStatutoryDeadlineAccepted: false,
    dueDateConvertedAutomaticallyIntoLegalDeadlineAccepted: false,
    courtDeadlineTreatedAsLowRiskAccepted: false,
    immigrationDeadlineTreatedAsLowRiskAccepted: false,
    appealDeadlineTreatedAsLowRiskAccepted: false,
    oneRiskLevelAssignedToEverySubtopicAccepted: false,
    processDepthIgnoresBlockedLevelsAccepted: false,
    allClaimTypesRequiredForEveryProcessAccepted: false,
    requiredClaimTypeMissingFromRelevantProcessAccepted: false,
    sourceRequirementOmittedAccepted: false,
    directPassageNotRequiredForHighRiskUseAccepted: false,
    competentAuthoritySourceOmittedAccepted: false,
    localSourceOmittedForLocalProcessAccepted: false,
    reviewStatusIgnoredAccepted: false,
    originalGermanCitationOmittedAccepted: false,
    authorityCategoryOmittedAccepted: false,
    nearbyAuthorityTreatedAsCompetentAccepted: false,
    nationwideMunicipalCoverageFalselyClaimedAccepted: false,
    pilotRegionOmittedDespiteLocalVariabilityAccepted: false,
    documentClassificationAuthorizesLegalConclusionAccepted: false,
    actorUnresolvedButConcreteInstructionIssuedAccepted: false,
    employerRoleIgnoredAccepted: false,
    insurerRoleIgnoredAccepted: false,
    authorityToAuthorityExchangeIgnoredAccepted: false,
    feeInferredFromStaleSourceAccepted: false,
    feeConflictIgnoredAccepted: false,
    deferredScopeTreatedAsLaunchScopeAccepted: false,
    completeImmigrationLawIncludedAccepted: false,
    fullEmploymentLawIncludedAccepted: false,
    fullTenancyLawIncludedAccepted: false,
    litigationIncludedAccepted: false,
    insolvencyIncludedAccepted: false,
    pensionLawIncludedAccepted: false,
    medicalAdviceIncludedAccepted: false,
    criminalLawIncludedAccepted: false,
    businessLicensingIncludedAccepted: false,
    germanLocaleDisablesDeSkCaseAccepted: false,
    deSkInstructionAllowedWithoutEuSourceAccepted: false,
    deSkInstructionAllowedWithoutGermanSourceAccepted: false,
    deSkInstructionAllowedWithoutSlovakSourceAccepted: false,
    competentAuthorityUnresolvedInDeSkCaseAccepted: false,
    crossBorderCitationsOmittedAccepted: false,
    familienkasseRemovedFromCrossBorderPriorityAccepted: false,
    healthInsuranceRemovedFromCrossBorderPreparationAccepted: false,
    unemploymentPeriodsRemovedFromPreparationAccepted: false,
    taxResidenceWorkFalselyMarkedImplementedAccepted: false,
    sourceContractTestOmittedAccepted: false,
    jurisdictionTestOmittedAccepted: false,
    effectiveDateTestOmittedAccepted: false,
    authorityCompetenceTestOmittedAccepted: false,
    citationTestOmittedAccepted: false,
    blockedOutputTestOmittedAccepted: false,
    localizationParityTestOmittedAccepted: false,
    noPersistenceTestOmittedAccepted: false,
    regressionTestOmittedAccepted: false,
    tamperTestOmittedAccepted: false,
    highRiskEscalationTestOmittedAccepted: false,
    crossBorderCompletenessTestOmittedAccepted: false,
    responsibleActorCrossBorderTestOmittedAccepted: false,
    temporalAlignmentTestOmittedAccepted: false,
    localeIndependentActivationTestOmittedAccepted: false,
    exitCriteriaPassWithMissingBlockedOutputsAccepted: false,
    exitCriteriaPassWithMissingRegionalPolicyAccepted: false,
    exitCriteriaPassWithMissingTestingRequirementsAccepted: false,
    germanKnowledgeClaimedPopulatedAccepted: false,
    sixLanguagesClaimedProductionReadyAccepted: false,
    anyTamperCaseSurvivedAccepted: false,

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejected: 0,
    tamperCasesRejectedCount: 0,

    waveOrderingRationale: WAVE_RATIONALE,
    waveOrderingRationaleFactors: WAVE_ORDERING_RATIONALE_FACTORS,
    claimTypes: CLAIM_TYPES,
    sourceCoverageCategories: SOURCE_COVERAGE_CATEGORIES,
    authorityCategories: AUTHORITY_CATEGORIES,
    regionalCoverageStates: REGIONAL_COVERAGE_STATES,
    pilotRegionStrategyElements: PILOT_REGION_STRATEGY_ELEMENTS,
    documentClasses: DOCUMENT_CLASSES,
    deadlineHandlingLevels: DEADLINE_HANDLING_LEVELS,
    feePolicyStates: FEE_POLICY_STATES,
    responsibleActors: RESPONSIBLE_ACTORS,
    standardTestingRequirements: STANDARD_TESTING_REQUIREMENTS,
    crossBorderTestingRequirements: CROSS_BORDER_TESTING_REQUIREMENTS,
    deferredGermanScope: DEFERRED_GERMAN_SCOPE,
    deSkPreparationPriorityTopics: DE_SK_PREPARATION_PRIORITY_TOPICS,
    deSkPilotRequirements: DE_SK_PILOT_REQUIREMENTS,
    processDepthLevels: PROCESS_DEPTH_LEVELS,
    allowedInitialDepths: ALLOWED_INITIAL_DEPTHS,
    restrictedInitialDepths: RESTRICTED_INITIAL_DEPTHS,
    blockedInitialDepths: BLOCKED_INITIAL_DEPTHS,
    processCoveragePlans: plans,
    knownOpenDebts: [
      "HEIC/HEIF support", "EXIF orientation normalization", "Decoded pixel bounds",
      "Serverless/Vercel OCR validation", "Physical Android camera-image validation",
      "Genuine iOS camera-image validation", "Distributed production rate limiter",
      "Standalone Smart Talk extraction from the DNA shell", "Final production payment flow",
      "German knowledge population (no real sources ingested by 9A, 9B, 9C, or 9D)",
      "V4/DE<->SK cross-border connector implementation (prepared, not implemented, in 9D)",
      "Minimal knowledge storage schema (PHASE 9E, must be derived from this plan)",
    ],
    sourceEvidence: [
      `onlyExpectedFilesChanged: ${evidence.onlyExpectedFilesChanged}`,
      `existingFileModified: ${evidence.existingFileModified}`,
      `newAuditFileCreated: ${evidence.newAuditFileCreated}`,
      `${PHASE_9A_REL_PATH} checkId found: ${evidence.sourceArchitectureCheckIdFound}`,
      `${PHASE_9A_REL_PATH} readiness wiring confirmed: ${evidence.sourceArchitectureReady}`,
      `${PHASE_9B_REL_PATH} checkId found: ${evidence.sourceTrustContractCheckIdFound}`,
      `${PHASE_9B_REL_PATH} readiness wiring confirmed: ${evidence.sourceTrustContractReady}`,
      `${PHASE_9C_REL_PATH} checkId found: ${evidence.sourceJurisdictionModelCheckIdFound}`,
      `${PHASE_9C_REL_PATH} readiness wiring confirmed: ${evidence.sourceJurisdictionModelReady}`,
      `${PHASE_9A_REL_PATH} standaloneSmartTalkExtractionRequiredLater: true present: ${evidence.standaloneExtractionStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} physicalAndroidStillUntested: ${evidence.physicalAndroidStillUntested}`,
      `${CLOSURE_8_13C_REL_PATH} genuineIosSafariStillUntested: ${evidence.genuineIosSafariStillUntested}`,
      `${CLOSURE_8_13C_REL_PATH} heicHeifStillOpen (derived): ${evidence.heicHeifStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} serverlessOcrStillOpen: ${evidence.serverlessOcrStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} distributedRateLimiterStillOpen (derived): ${evidence.distributedRateLimiterStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} paymentFlowStillOpen ("Final production payment flow" present): ${evidence.paymentFlowStillOpen}`,
      "This audit read only committed plain text for the 9A, 9B and 9C audits, and the 8.13C closure audit — none were imported or executed.",
      "Zero real sources ingested, zero real authorities registered, zero real processes populated, zero real claims populated, zero cross-border connectors implemented, zero database rows, zero network/retrieval/model/OCR calls, zero user-content persistence.",
    ],
    notes: evidence.notes,
  };
}

// ─── Entry point ────────────────────────────────────────────────────────────

export function runMinimumGermanProcessCoveragePlanAudit(): Result {
  const evidence = collectEvidence();
  const good = buildGoodResult(evidence);
  const tamperOutcome = runTamperCases(good);

  const allPassed = computeExpectedAllPassed(good) && tamperOutcome.rejected === tamperOutcome.total && good.allPassed;

  return {
    ...good,
    allPassed,
    tamperCasesRejected: tamperOutcome.rejected,
    tamperCasesRejectedCount: tamperOutcome.rejected,
    readyForMinimalKnowledgeStorageSchema: allPassed,
    notes: [
      ...good.notes,
      `Tamper rejection: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      ...(tamperOutcome.failures.length > 0 ? [`Tamper failures: ${tamperOutcome.failures.join("; ")}`] : []),
    ],
  };
}

if (require.main === module) {
  const result = runMinimumGermanProcessCoveragePlanAudit();
  console.log(JSON.stringify(result));
}
