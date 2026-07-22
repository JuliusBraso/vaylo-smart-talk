/**
 * PHASE 9K — Publication and Canonical Translation Schema Extension Design
 * (Schema Design and Audit Only)
 *
 * Building on PHASE 9A-9J, this file designs the exact additive
 * PostgreSQL/Supabase schema extension required to resolve the two blocking
 * schema gaps identified in PHASE 9J (publication lifecycle, canonical
 * translation layer) — as a design contract only. It:
 *
 *   1. Encodes the selected publication schema design: a two-layer model
 *      (current-state projection + append-only transition history), the
 *      9-state lifecycle, an explicit 20-transition state machine (the
 *      prompt's 17 analyzed pairs, plus the mandatory null->draft creation
 *      transition and 2 audit-added completeness transitions), and a
 *      10-condition runtime-retrieval AND-gate.
 *   2. Encodes the selected translation schema design: one generic
 *      polymorphic table for the 8 unit kinds that need new storage, plus
 *      an explicit finding that "warning text" and "outcome guidance" are
 *      already fully served by the *existing* knowledge_terminology /
 *      knowledge_localized_terminology tables and need no new table.
 *   3. Encodes canonical-version binding via content fingerprinting (not a
 *      nonexistent "canonical_version_id" column), synchronous
 *      invalidation-on-change, and a database-level CHECK constraint that
 *      makes machine-translation auto-approval structurally impossible.
 *   4. Compares polymorphic entity_type/entity_id against a canonical-unit
 *      registry table (matching migration 032's own existing, explicitly
 *      self-documented polymorphic convention) and selects polymorphic,
 *      with a registry marked "optional_later", never "required_now".
 *   5. Statically inspects `supabase/migrations/032_create_minimal_knowledge_schema.sql`,
 *      the PHASE 9I audit file and the PHASE 9J audit file as plain text
 *      (never imports/executes any of them) to ground every count in real
 *      repository evidence.
 *   6. Runs read-only `git` commands to confirm this phase created exactly
 *      one new file and modified no existing file.
 *   7. Runs a large set of pure, in-memory tamper cases against a
 *      deep-cloned "good" Result and confirms each mutation is rejected.
 *   8. Prints a structured JSON report when executed.
 *
 * Zero SQL is created, zero migrations are applied, zero databases (local
 * or remote) are touched, zero Docker/Supabase processes are started, zero
 * real sources are fetched, zero rows are inserted, zero runtime retrieval
 * is enabled, zero publication occurs. Every table/column/constraint below
 * is a design candidate only, never an implemented fact.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// ─── Source / chain constants ───────────────────────────────────────────────

const SOURCE_CLOSURE_COMMIT = "8013e27";
const SOURCE_PACK_PLAN_CHECK_ID = "9J";

const MIGRATIONS_DIR_REL_PATH = "supabase/migrations";
const MIGRATION_FILE_NAME = "032_create_minimal_knowledge_schema.sql";
const MIGRATION_REL_PATH = `${MIGRATIONS_DIR_REL_PATH}/${MIGRATION_FILE_NAME}`;
const PHASE_9I_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-knowledge-ingestion-architecture-and-first-process-pack-design-audit.ts";
const PHASE_9J_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-first-german-process-pack-implementation-plan-and-schema-gap-resolution-boundary-audit.ts";
const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-extension-design-audit.ts";

const LAUNCH_LOCALES = ["de", "en", "sk", "cs", "pl", "hu"] as const;
const FUTURE_LOCALES = ["ro", "bg", "uk", "tr", "ru"] as const;
const NON_GERMAN_LAUNCH_LOCALES = LAUNCH_LOCALES.filter((l) => l !== "de");

const EXPECTED_KNOWLEDGE_TABLE_COUNT = 33;
const FIRST_PROCESS_PACK_ID = "anmeldung_ummeldung_abmeldung" as const;
const FIRST_CROSS_BORDER_PILOT = "familienkasse_kindergeld" as const;

function runGitReadOnly(cmd: string): string {
  try {
    return execSync(cmd, { encoding: "utf8", cwd: process.cwd(), timeout: 8000 }).trim();
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

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

// ============================================================================
// STATIC MIGRATION-032 INSPECTION (dynamic; never guessed/hardcoded)
// ============================================================================

function extractKnowledgeTableNames(sql: string): string[] {
  const re = /create table if not exists public\.(knowledge_[a-z0-9_]+)\s*\(/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) names.push(m[1]);
  return names;
}

function extractRlsEnabledTables(sql: string): string[] {
  const re = /alter table public\.(knowledge_[a-z0-9_]+) enable row level security;/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) names.push(m[1]);
  return names;
}

function migrationHasInsertStatements(sql: string): boolean {
  return /\binsert\s+into\b/i.test(sql);
}

function migrationHasAnonOrAuthenticatedPolicy(sql: string): boolean {
  return /\bcreate policy\b/i.test(sql);
}

function migrationUsesJsonb(sql: string): boolean {
  return /\bjsonb\b/i.test(sql);
}

function migrationHasDropOrRename(sql: string): boolean {
  return /\bdrop\s+table\b|\bdrop\s+column\b|\brename\s+(table|column)\b/i.test(sql);
}

// ============================================================================
// PART A.1 — PUBLICATION STATE MODEL
// ============================================================================

type PublicationState =
  | "draft" | "evidence_incomplete" | "review_required" | "approved" | "publication_eligible"
  | "published" | "suspended" | "superseded" | "withdrawn";

const PUBLICATION_STATES: readonly PublicationState[] = [
  "draft", "evidence_incomplete", "review_required", "approved", "publication_eligible",
  "published", "suspended", "superseded", "withdrawn",
];

interface StateRepresentationOption {
  option: "postgresql_native_enum" | "checked_text_domain" | "lookup_table";
  futureExtensibility: string;
  migrationSafety: string;
  constraintStrength: string;
  typescriptGeneration: string;
  operationalClarity: string;
  rollbackBehavior: string;
  selected: boolean;
}

const STATE_REPRESENTATION_COMPARISON: readonly StateRepresentationOption[] = [
  { option: "postgresql_native_enum",
    futureExtensibility: "Weak: ALTER TYPE ... ADD VALUE cannot remove/reorder values and historically could not run inside the same transaction as other DDL (relaxed in PG12+, but still a distinct operational mode from every other migration-032 constraint).",
    migrationSafety: "Lower: introduces a brand-new PostgreSQL type-system concept absent from all 33 existing tables — a bigger blast radius for a first extension migration.",
    constraintStrength: "Strong at the type level, but no stronger in practice than a CHECK constraint for a small fixed vocabulary.",
    typescriptGeneration: "Generated types would render as a TS union either way; no material benefit over CHECK-constrained text.",
    operationalClarity: "Lower: introduces a second enum mechanism alongside the 30+ existing CHECK-constrained text columns, fragmenting convention.",
    rollbackBehavior: "Harder: dropping/altering a native enum type used by a column requires more ceremony than dropping a CHECK constraint.",
    selected: false },
  { option: "checked_text_domain",
    futureExtensibility: "Strong: widening the vocabulary is `alter table ... drop constraint ...; alter table ... add constraint ... check (...)`, additive and reversible, matching how every existing knowledge_* status/type column already evolves.",
    migrationSafety: "Highest: this is the exact, 100%-consistent pattern already used by all 30+ status/type columns in migration 032 (review_status, freshness_status, change_status, conflict_status, status, output_locale, jurisdiction_level, fee_status, etc.) — zero new mechanism introduced.",
    constraintStrength: "Strong: CHECK constraints are enforced identically to enum-backed columns for a fixed, small vocabulary.",
    typescriptGeneration: "Generated types render as `string` (or a literal union if the generator introspects CHECK constraints) exactly like every other status column today — no regression.",
    operationalClarity: "Highest: reviewers and future migrations only need to understand one pattern across the entire schema.",
    rollbackBehavior: "Easiest: dropping a CHECK constraint is a single, fully-additive, non-destructive statement.",
    selected: true },
  { option: "lookup_table",
    futureExtensibility: "Adds row-level metadata capability (e.g. display order, permissions) that this fixed 9/8-value vocabulary does not need.",
    migrationSafety: "Adds an extra join for every query that needs to validate or display a state — unnecessary indirection for a vocabulary that is not expected to need per-value metadata.",
    constraintStrength: "Equivalent to a FK-enforced CHECK, but at the cost of an extra table and join.",
    typescriptGeneration: "No material benefit; would still resolve to a string literal type in practice.",
    operationalClarity: "Lower for this specific case: over-engineered for 9 (or 8) fixed, code-defined values with no need for runtime configurability.",
    rollbackBehavior: "Comparable to the text-domain option but with an extra table to manage.",
    selected: false },
];

const SELECTED_STATE_REPRESENTATION = STATE_REPRESENTATION_COMPARISON.find((o) => o.selected)!;

// ─── State machine ───────────────────────────────────────────────────────

interface StateTransitionSpec {
  from: PublicationState | null;
  to: PublicationState;
  requiresPublicationAuthorization: boolean;
  requiresEnhancedHighRiskReview: boolean;
  requiresSupersedingReference: boolean;
  forbiddenWithoutReason: boolean;
  forbiddenWithoutEvidence: boolean;
  addedBeyondPromptExplicitList: boolean;
  rationale: string;
}

const ALLOWED_TRANSITIONS: readonly StateTransitionSpec[] = [
  { from: null, to: "draft", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: false, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: false,
    rationale: "The only transition with from=null: initial creation of the publication-state row alongside the canonical unit's own creation." },
  { from: "draft", to: "evidence_incomplete", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: false, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: false,
    rationale: "Extraction/authoring detects the unit lacks required evidence before it can be reviewed." },
  { from: "draft", to: "review_required", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: false, forbiddenWithoutEvidence: true, addedBeyondPromptExplicitList: false,
    rationale: "Evidence already sufficient at draft time; ready for review without an intermediate evidence-gathering step." },
  { from: "evidence_incomplete", to: "review_required", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: false, forbiddenWithoutEvidence: true, addedBeyondPromptExplicitList: false,
    rationale: "Missing evidence has been supplied; the unit can now enter review." },
  { from: "review_required", to: "approved", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: true, requiresSupersedingReference: false, forbiddenWithoutReason: false, forbiddenWithoutEvidence: true, addedBeyondPromptExplicitList: false,
    rationale: "Human/expert review has passed; enhanced review is additionally required when the underlying entity's risk_level warrants it." },
  { from: "review_required", to: "evidence_incomplete", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: false,
    rationale: "Reviewer determines evidence is in fact insufficient and returns the unit for more evidence." },
  { from: "approved", to: "publication_eligible", requiresPublicationAuthorization: true, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: false, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: false,
    rationale: "Crossing into eligibility is a publication-authorization event, not a plain review event." },
  { from: "approved", to: "review_required", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: false,
    rationale: "A previously-approved unit is sent back for re-review (e.g. a re-review trigger fired)." },
  { from: "publication_eligible", to: "published", requiresPublicationAuthorization: true, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: false, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: false,
    rationale: "The actual publication act is itself a publication-authorization event." },
  { from: "publication_eligible", to: "review_required", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: false,
    rationale: "A newly-detected issue (e.g. a conflict) removes eligibility before actual publication occurred." },
  { from: "published", to: "suspended", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: false,
    rationale: "Reversible protective action for stale source / conflict / authority error / translation defect / emergency governance issue." },
  { from: "suspended", to: "published", requiresPublicationAuthorization: true, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: false,
    rationale: "Reinstatement after the suspension cause is resolved; requires the same authorization level as original publication." },
  { from: "suspended", to: "review_required", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: false,
    rationale: "The suspension cause requires deeper rework, not a simple reinstatement." },
  { from: "published", to: "superseded", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: true, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: false,
    rationale: "A replacement unit exists; this transition row must reference the replacement's own publication-state transition." },
  { from: "published", to: "withdrawn", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: false,
    rationale: "Terminal removal without an immediate replacement." },
  { from: "publication_eligible", to: "withdrawn", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: false,
    rationale: "Withdrawn before ever being published (e.g. a decision reversal after eligibility but before publication)." },
  { from: "approved", to: "withdrawn", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: false,
    rationale: "Withdrawn after approval but before eligibility was ever granted." },
  { from: "review_required", to: "withdrawn", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: false,
    rationale: "Withdrawn while still in review (e.g. the underlying claim is determined to be entirely wrong)." },
  { from: "draft", to: "withdrawn", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: true,
    rationale: "Audit-added completeness fix: a draft later found to be entirely wrong (e.g. wrong process variant) must have a terminal exit path without being forced through review_required first." },
  { from: "evidence_incomplete", to: "withdrawn", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, addedBeyondPromptExplicitList: true,
    rationale: "Audit-added completeness fix: a unit permanently stuck without obtainable evidence must have a terminal exit path." },
];

function computeTerminalStates(): readonly PublicationState[] {
  return PUBLICATION_STATES.filter((s) => !ALLOWED_TRANSITIONS.some((t) => t.from === s));
}

function computeReversibleStates(): readonly PublicationState[] {
  const pairs = new Set<string>();
  for (const t of ALLOWED_TRANSITIONS) {
    if (t.from === null) continue;
    pairs.add(`${t.from}->${t.to}`);
  }
  const reversible = new Set<PublicationState>();
  for (const t of ALLOWED_TRANSITIONS) {
    if (t.from === null) continue;
    if (pairs.has(`${t.to}->${t.from}`)) {
      reversible.add(t.from);
      reversible.add(t.to);
    }
  }
  return PUBLICATION_STATES.filter((s) => reversible.has(s));
}

const TERMINAL_STATES = computeTerminalStates();
const REVERSIBLE_STATES = computeReversibleStates();

function transitionIsAllowed(from: PublicationState | null, to: PublicationState): boolean {
  return ALLOWED_TRANSITIONS.some((t) => t.from === from && t.to === to);
}

// ============================================================================
// PART A.2 — PUBLICATION SUBJECT MODEL (derived from migration 032)
// ============================================================================

type PublicationSubjectType =
  | "source" | "source_version" | "claim" | "process" | "process_step"
  | "document_requirement" | "deadline_rule" | "authority_resolution_unit"
  | "warning_unit" | "outcome_unit" | "canonical_translation" | "complete_process_pack_version";

interface PublicationSubjectSpec {
  entityType: PublicationSubjectType;
  canonicalIdentity: string;
  targetTable: string;
  targetPrimaryKeyType: "uuid";
  appliesDirectlyToRowOrVersion: "row_is_the_version" | "row_is_versionless_reference";
  effectiveDatesAffectPublication: boolean;
  jurisdictionAffectsPublication: boolean;
  requiredEvidenceState: string;
  requiredReviewState: string;
  requiredCitationState: string;
  runtimeRetrievalRelationship: string;
  mergedFromPromptConcepts: readonly string[];
}

const PUBLICATION_SUBJECT_TYPES: readonly PublicationSubjectSpec[] = [
  { entityType: "source", canonicalIdentity: "knowledge_sources.id", targetTable: "knowledge_sources", targetPrimaryKeyType: "uuid",
    appliesDirectlyToRowOrVersion: "row_is_versionless_reference", effectiveDatesAffectPublication: false, jurisdictionAffectsPublication: true,
    requiredEvidenceState: "publisher competence + official-domain classification present", requiredReviewState: "at least machine_prechecked",
    requiredCitationState: "n/a at the source level (citations attach to source_versions/passages)", runtimeRetrievalRelationship: "indirect only, via the source_version(s) it owns",
    mergedFromPromptConcepts: ["source"] },
  { entityType: "source_version", canonicalIdentity: "knowledge_source_versions.id", targetTable: "knowledge_source_versions", targetPrimaryKeyType: "uuid",
    appliesDirectlyToRowOrVersion: "row_is_the_version", effectiveDatesAffectPublication: true, jurisdictionAffectsPublication: false,
    requiredEvidenceState: "content_hash computed; passages segmented", requiredReviewState: "human_reviewed before any claim may cite it for a high-risk use",
    requiredCitationState: "n/a; source_versions are cited, not themselves citing", runtimeRetrievalRelationship: "gates every claim/citation that references it via current_use_allowed/historical_use_allowed",
    mergedFromPromptConcepts: ["source_version"] },
  { entityType: "claim", canonicalIdentity: "knowledge_claims.id", targetTable: "knowledge_claims", targetPrimaryKeyType: "uuid",
    appliesDirectlyToRowOrVersion: "row_is_the_version", effectiveDatesAffectPublication: true, jurisdictionAffectsPublication: true,
    requiredEvidenceState: "at least one knowledge_claim_evidence_links row with review_accepted=true", requiredReviewState: "human_reviewed (expert_reviewed for high-risk risk_level)",
    requiredCitationState: "at least one knowledge_citations row with non-null source_version_id and passage_id", runtimeRetrievalRelationship: "direct: this is the primary retrievable unit",
    mergedFromPromptConcepts: ["claim"] },
  { entityType: "process", canonicalIdentity: "knowledge_processes.id", targetTable: "knowledge_processes", targetPrimaryKeyType: "uuid",
    appliesDirectlyToRowOrVersion: "row_is_the_version", effectiveDatesAffectPublication: true, jurisdictionAffectsPublication: true,
    requiredEvidenceState: "n/a directly; inherited from the claims linked via knowledge_process_claim_links", requiredReviewState: "human_reviewed",
    requiredCitationState: "n/a directly; inherited from linked claims", runtimeRetrievalRelationship: "direct: gates whether the process (variant) itself is retrievable",
    mergedFromPromptConcepts: ["process_definition", "process_version or equivalent versioned process unit"] },
  { entityType: "process_step", canonicalIdentity: "knowledge_process_steps.id", targetTable: "knowledge_process_steps", targetPrimaryKeyType: "uuid",
    appliesDirectlyToRowOrVersion: "row_is_the_version", effectiveDatesAffectPublication: true, jurisdictionAffectsPublication: true,
    requiredEvidenceState: "n/a directly; inherited from linked claims", requiredReviewState: "human_reviewed",
    requiredCitationState: "n/a directly; inherited from linked claims", runtimeRetrievalRelationship: "direct: gates whether the step itself is retrievable",
    mergedFromPromptConcepts: ["process_step"] },
  { entityType: "document_requirement", canonicalIdentity: "knowledge_evidence_requirements.id", targetTable: "knowledge_evidence_requirements", targetPrimaryKeyType: "uuid",
    appliesDirectlyToRowOrVersion: "row_is_the_version", effectiveDatesAffectPublication: true, jurisdictionAffectsPublication: true,
    requiredEvidenceState: "source_version_id/passage_id present when required_by is a real source-backed requirement", requiredReviewState: "human_reviewed",
    requiredCitationState: "via knowledge_form_requirements.source_passage_id when field-level", runtimeRetrievalRelationship: "direct: gates whether the requirement is shown to a user",
    mergedFromPromptConcepts: ["document_requirement"] },
  { entityType: "deadline_rule", canonicalIdentity: "knowledge_deadline_rules.id", targetTable: "knowledge_deadline_rules", targetPrimaryKeyType: "uuid",
    appliesDirectlyToRowOrVersion: "row_is_the_version", effectiveDatesAffectPublication: true, jurisdictionAffectsPublication: true,
    requiredEvidenceState: "source_version_id + passage_id both non-null (schema-required already)", requiredReviewState: "human_reviewed (expert_reviewed for high-risk risk_level)",
    requiredCitationState: "source_version_id + passage_id (schema-required already)", runtimeRetrievalRelationship: "direct: gates whether the deadline is shown",
    mergedFromPromptConcepts: ["deadline_rule"] },
  { entityType: "authority_resolution_unit", canonicalIdentity: "knowledge_authority_competences.id", targetTable: "knowledge_authority_competences", targetPrimaryKeyType: "uuid",
    appliesDirectlyToRowOrVersion: "row_is_the_version", effectiveDatesAffectPublication: true, jurisdictionAffectsPublication: true,
    requiredEvidenceState: "competence_source_version_id non-null (schema-required already)", requiredReviewState: "human_reviewed",
    requiredCitationState: "competence_source_version_id + optional competence_passage_id", runtimeRetrievalRelationship: "direct: gates whether the authority-resolution guidance is shown",
    mergedFromPromptConcepts: ["authority_resolution_unit"] },
  { entityType: "warning_unit", canonicalIdentity: "knowledge_terminology.id (one row per fixed warning-type message template)", targetTable: "knowledge_terminology", targetPrimaryKeyType: "uuid",
    appliesDirectlyToRowOrVersion: "row_is_the_version", effectiveDatesAffectPublication: false, jurisdictionAffectsPublication: false,
    requiredEvidenceState: "n/a; warning templates are governance text, not sourced legal claims", requiredReviewState: "human_reviewed",
    requiredCitationState: "n/a", runtimeRetrievalRelationship: "indirect: warnings are always computed/shown regardless of the triggering claim's own publication state; never suppressed by publication logic",
    mergedFromPromptConcepts: ["warning_unit"] },
  { entityType: "outcome_unit", canonicalIdentity: "knowledge_terminology.id (one row per fixed outcome-type guidance template)", targetTable: "knowledge_terminology", targetPrimaryKeyType: "uuid",
    appliesDirectlyToRowOrVersion: "row_is_the_version", effectiveDatesAffectPublication: false, jurisdictionAffectsPublication: false,
    requiredEvidenceState: "n/a; outcome guidance is a fixed structural vocabulary, not a sourced legal claim", requiredReviewState: "human_reviewed",
    requiredCitationState: "n/a", runtimeRetrievalRelationship: "indirect: shown alongside a process step regardless of that step's own publication state",
    mergedFromPromptConcepts: ["outcome_unit"] },
  { entityType: "canonical_translation", canonicalIdentity: "knowledge_canonical_unit_translations.id", targetTable: "knowledge_canonical_unit_translations", targetPrimaryKeyType: "uuid",
    appliesDirectlyToRowOrVersion: "row_is_the_version", effectiveDatesAffectPublication: false, jurisdictionAffectsPublication: false,
    requiredEvidenceState: "derived from translation_status; a separate knowledge_publication_states row is optional and non-authoritative for this entity type",
    requiredReviewState: "human_reviewed=true on the translation row itself", requiredCitationState: "n/a; canonical_content_fingerprint is the binding mechanism, not a citation",
    runtimeRetrievalRelationship: "direct, but translation_status is authoritative; the publication_states row is a thin, optional uniformity wrapper",
    mergedFromPromptConcepts: ["canonical_translation"] },
  { entityType: "complete_process_pack_version", canonicalIdentity: "the anmeldung-variant knowledge_processes.id acting as the pack's stable anchor for process_group_id='anmeldung_ummeldung_abmeldung'", targetTable: "knowledge_processes", targetPrimaryKeyType: "uuid",
    appliesDirectlyToRowOrVersion: "row_is_versionless_reference", effectiveDatesAffectPublication: true, jurisdictionAffectsPublication: true,
    requiredEvidenceState: "all constituent process/step/claim rows for the process_group_id at required review levels", requiredReviewState: "human_reviewed on every constituent unit",
    requiredCitationState: "inherited from constituent claims", runtimeRetrievalRelationship: "compositional: gates retrieval of the pack as a whole in addition to each unit's own state (see runtime AND-gate condition 10)",
    mergedFromPromptConcepts: ["complete_process_pack_version"] },
];

// ============================================================================
// PART A.3 — CURRENT-STATE TABLE DESIGN
// ============================================================================

interface FieldDecision {
  field: string;
  included: boolean;
  typeContract: string;
  rationale: string;
}

const CURRENT_STATE_FIELD_DECISIONS: readonly FieldDecision[] = [
  { field: "id", included: true, typeContract: "uuid primary key default gen_random_uuid()", rationale: "Standard surrogate key, matches every existing knowledge_* table." },
  { field: "entity_type", included: true, typeContract: "text not null check (entity_type in <12 PublicationSubjectType values>)", rationale: "Polymorphic type discriminator, matching migration 032's existing entity_type convention." },
  { field: "entity_id", included: true, typeContract: "uuid not null", rationale: "Polymorphic target id; not a real FK (see referential-integrity design)." },
  { field: "current_state", included: true, typeContract: "text not null check (current_state in <9 PublicationState values>)", rationale: "The projected current state itself." },
  { field: "current_transition_id", included: true, typeContract: "uuid not null references knowledge_publication_state_transitions(id) on delete restrict", rationale: "Every current state must be traceable to the exact transition that produced it — this is what makes 'current state derived from an accepted transition' enforceable, not just documented." },
  { field: "state_version", included: true, typeContract: "integer not null default 1 check (state_version > 0)", rationale: "Optimistic-concurrency counter; the transition RPC requires the caller's last-read state_version to match, preventing lost-update races between two concurrent transition attempts." },
  { field: "publication_scope", included: false, typeContract: "n/a — rejected", rationale: "Rejected as redundant: entity_id already disambiguates to the exact object at the finest granularity needed (e.g. each locale's translation is already its own row via entity_id), so a separate scope dimension would duplicate that disambiguation without adding information." },
  { field: "effective_from", included: true, typeContract: "timestamptz", rationale: "Publication-level effective window, distinct from (but consulted alongside) the underlying canonical row's own effective_from." },
  { field: "effective_until", included: true, typeContract: "timestamptz", rationale: "Symmetric with effective_from." },
  { field: "jurisdiction_id", included: true, typeContract: "uuid references knowledge_jurisdictions(id) on delete restrict — nullable", rationale: "A real FK, not a boolean 'inherited' flag: null means jurisdiction is inherited from the underlying canonical entity; non-null is an explicit publication-level override (rare)." },
  { field: "reason_code", included: true, typeContract: "text — nullable, denormalized copy of the current transition's transition_reason_code", rationale: "Deliberate denormalization for fast filtering/indexing (e.g. 'all currently suspended for stale_source_suspension') without a join to the history table on every query; not 'redundant for convenience', but a query-performance-justified duplication of a single small field." },
  { field: "emergency_disabled", included: true, typeContract: "boolean not null default false, denormalized copy of the current transition's emergency_flag", rationale: "Same query-performance justification as reason_code." },
  { field: "created_at", included: true, typeContract: "timestamptz not null default now()", rationale: "Standard." },
  { field: "updated_at", included: true, typeContract: "timestamptz not null default now(), updated by the transition RPC only", rationale: "Standard; the ONLY table in this extension whose row is genuinely mutated in place, and only via the RPC, never a bare UPDATE." },
];

const CURRENT_STATE_TABLE_NAME_CANDIDATE = "knowledge_publication_states";
const CURRENT_STATE_TABLE_DESIGN = {
  name: CURRENT_STATE_TABLE_NAME_CANDIDATE,
  purpose: "One row per publication subject: the current state only. A mutable pointer, never itself the source of historical truth.",
  fields: CURRENT_STATE_FIELD_DECISIONS,
  primaryKey: "id",
  uniqueConstraints: ["unique(entity_type, entity_id) — deterministic uniqueness: exactly one current-state row per publication subject"],
  checkConstraints: ["current_state in <9 states>", "entity_type in <12 subject types>", "state_version > 0"],
  onePerSubjectAndScope: true,
  optimisticConcurrencyStrategy: "state_version integer, compared-and-incremented by the transition RPC in a single UPDATE ... WHERE state_version = $expected statement",
  orphanPolymorphicReferencePrevention: "BEFORE INSERT/UPDATE trigger dispatches on entity_type to run a targeted EXISTS check against the one correct target table; not a real multi-table FK (PostgreSQL cannot express that)",
  invalidEntityTypeIdCombinationPrevention: "Same trigger; entity_type is itself CHECK-constrained to the 12 known values first",
  currentStateDerivedFromAcceptedTransition: true,
  currentStateIndependentlyEditableWithoutHistory: false,
  silentCurrentStateRewritePrevented: "A second trigger validates that current_transition_id's own to_state column equals the row's current_state before allowing the write — cross-table validation via trigger, not a CHECK (PostgreSQL CHECK cannot reference another table).",
  isDesignCandidateOnly: true,
} as const;

// ============================================================================
// PART A.4 — TRANSITION-HISTORY TABLE DESIGN
// ============================================================================

const TRANSITION_REASON_CODES = [
  "initial_draft", "evidence_completed", "review_passed", "review_failed_returned_to_evidence",
  "approved", "eligibility_confirmed", "published", "stale_source_suspension", "conflict_suspension",
  "authority_error_suspension", "translation_defect_suspension", "emergency_governance_suspension",
  "reinstated_after_suspension", "superseded_by_new_version", "withdrawn_reason_required", "manual_correction",
] as const;

const SUSPENSION_OR_WITHDRAWAL_REQUIRED_REASON_CODES = [
  "stale_source_suspension", "conflict_suspension", "authority_error_suspension",
  "translation_defect_suspension", "emergency_governance_suspension", "withdrawn_reason_required",
] as const;

const TRANSITION_HISTORY_FIELD_DECISIONS: readonly FieldDecision[] = [
  { field: "id", included: true, typeContract: "uuid primary key default gen_random_uuid()", rationale: "Standard." },
  { field: "entity_type / entity_id", included: true, typeContract: "text not null check (...) / uuid not null", rationale: "Same polymorphic subject reference as the current-state table." },
  { field: "from_state", included: true, typeContract: "text check (from_state in <9 states>) — nullable, null only for the initial draft-creation row, enforced by check ((from_state is null) = (to_state = 'draft'))", rationale: "A single strong CHECK constraint encodes exactly which transition may have a null origin." },
  { field: "to_state", included: true, typeContract: "text not null check (to_state in <9 states>)", rationale: "Standard." },
  { field: "transition_reason", included: true, typeContract: "text — free-text human-readable reason", rationale: "Required (non-null enforced at the RPC layer) for the reason-code subset requiring it." },
  { field: "transition_reason_code", included: true, typeContract: "text not null check (transition_reason_code in <16 fixed codes>)", rationale: "Machine-readable classification decoupled from free text, enabling analytics/filtering." },
  { field: "requested_by (renamed requested_by_actor_type + requested_by_identifier)", included: true, typeContract: "requested_by_actor_type text not null / requested_by_identifier text nullable", rationale: "A bare uuid 'requested_by' would have no FK target since this schema deliberately has no user-content table; renamed to mirror the EXISTING actor_type convention already used by knowledge_review_records.reviewer_type and knowledge_audit_events.actor_type." },
  { field: "authorized_by (renamed authorized_by_actor_type + authorized_by_identifier + authorization_role)", included: true, typeContract: "authorized_by_actor_type text nullable / authorized_by_identifier text nullable / authorization_role text nullable", rationale: "Same actor-type convention; nullable because not every transition requires authorization (see requiresPublicationAuthorization per transition)." },
  { field: "review evidence reference", included: true, typeContract: "review_record_id uuid references knowledge_review_records(id) on delete restrict — nullable", rationale: "Reuses the EXISTING knowledge_review_records table rather than duplicating review evidence columns." },
  { field: "transition timestamp", included: true, typeContract: "transitioned_at timestamptz not null default now()", rationale: "Standard." },
  { field: "effective timestamp", included: true, typeContract: "effective_at timestamptz — nullable, for retroactive corrections (e.g. a withdrawal that legally took effect earlier than it was recorded); never used to schedule a FUTURE automatic transition", rationale: "Kept distinct from transitioned_at to preserve the 'no automatic publication' principle: this column may only be backdated, never forward-dated to schedule an unattended future transition (enforced at the RPC layer)." },
  { field: "emergency_flag", included: true, typeContract: "boolean not null default false", rationale: "Standard." },
  { field: "rollback-of-transition reference", included: true, typeContract: "rollback_of_transition_id uuid references knowledge_publication_state_transitions(id) on delete restrict — nullable", rationale: "Corrective transitions point back at the mistaken one they correct; the mistaken row is never edited or deleted." },
  { field: "superseded-by-transition reference", included: true, typeContract: "superseding_transition_id uuid references knowledge_publication_state_transitions(id) on delete set null — nullable, populated ONLY at INSERT time on the transition whose to_state='superseded' (never retro-actively written onto an older row, which would violate append-only)", rationale: "Resolves an apparent contradiction: this column is set once, at creation of the superseding transition itself, not by mutating history afterward." },
  { field: "metadata/provenance (renamed provenance_note)", included: true, typeContract: "provenance_note text — nullable free text", rationale: "Migration 032 contains zero jsonb columns anywhere (verified by inspection); introducing jsonb here would be a new, inconsistent type-convention. A free-text note mirrors knowledge_review_records.notes / knowledge_regional_overrides' existing text-note conventions." },
  { field: "created_at", included: true, typeContract: "timestamptz not null default now()", rationale: "Standard." },
];

const TRANSITION_HISTORY_TABLE_NAME_CANDIDATE = "knowledge_publication_state_transitions";
const TRANSITION_HISTORY_TABLE_DESIGN = {
  name: TRANSITION_HISTORY_TABLE_NAME_CANDIDATE,
  purpose: "Append-only full history: one row per transition, never UPDATEd or DELETEd.",
  fields: TRANSITION_HISTORY_FIELD_DECISIONS,
  primaryKey: "id",
  checkConstraints: [
    "from_state in <9 states> or null", "to_state in <9 states>",
    "(from_state is null) = (to_state = 'draft')",
    "transition_reason_code in <16 codes>",
  ],
  appendOnlyEnforcement: "Unconditional BEFORE UPDATE OR DELETE trigger raising an exception on every attempt, from row #1 — stricter than knowledge_source_versions' 'only once locked' pattern, and directly resolves PHASE 9J's Gap 5 (no generic append-only trigger) for this table.",
  isDesignCandidateOnly: true,
} as const;

// ============================================================================
// PART A.5 — SUSPENSION / WITHDRAWAL / SUPERSESSION / EMERGENCY DISABLE
// ============================================================================

const SUSPENSION_DESIGN = {
  reversible: true, immediatelyExcludedFromRuntimeRetrieval: true, historicallyAuditable: true,
  usableFor: ["stale_source_suspension", "conflict_suspension", "authority_error_suspension", "translation_defect_suspension", "emergency_governance_suspension"] as const,
  distinctFromWithdrawal: true, equivalentToDeletion: false,
} as const;

const WITHDRAWAL_DESIGN = {
  terminalForSpecificUnit: true, excludedFromRuntimeRetrieval: true, historicallyRetained: true,
  reasonRequired: true, reversibleToPublished: false, physicallyDeleted: false,
  correctedReplacementStrategy: "A new or superseding canonical/versioned unit must be created; the withdrawn unit's row and history are never reused for the correction.",
} as const;

const SUPERSESSION_DESIGN = {
  preservesOldUnit: true, linksToReplacementWhereApplicable: true,
  preventsCurrentTimeRetrievalOfSupersededUnit: true, permitsHistoricalRetrievalOnlyWhenExplicitlyRequestedAndAuthorized: true,
  overwritesOldRecord: false,
} as const;

const EMERGENCY_DISABLE_DESIGN = {
  whoCanRequest: "Any reviewer role, or an automated change-monitoring job.",
  whoCanAuthorize: "The emergency_suspension_authorizer role (defined in PHASE 9J's human-review plan).",
  singleActorPermittedInUrgentCases: true,
  singleActorException: "Only ever moves an entity toward 'suspended', never toward 'withdrawn' or 'published' — the normal multi-reviewer/separation-of-duties requirement is waived only for this one restrictive direction.",
  mandatoryReason: true,
  mandatoryAuditTransition: "emergency_flag=true on the transition row AND a corresponding knowledge_audit_events row in the same transaction.",
  runtimeEffect: "current_state flips to 'suspended' and the corresponding knowledge_retrieval_metadata indexing flags flip to false, atomically, in the same RPC transaction.",
  followUpReviewRequirement: "An emergency-flagged suspension automatically creates a knowledge_review_records row with review_status='review_required' and a near-term review_due_at.",
  recoveryTransition: "suspended -> published (requires full authorization + review_record, never single-actor) or suspended -> review_required.",
  noDeletion: true, noEvidenceLoss: true,
} as const;

// ============================================================================
// PART A.6 — PUBLICATION ELIGIBILITY GATE
// ============================================================================

interface EligibilityCondition {
  condition: string;
  enforcement: "database" | "application_or_governance";
  mechanism: string;
}

const PUBLICATION_ELIGIBILITY_GATE: readonly EligibilityCondition[] = [
  { condition: "canonical German record exists", enforcement: "database", mechanism: "NOT NULL entity_id + trigger-validated existence via the entity_type dispatch." },
  { condition: "immutable source version exists", enforcement: "database", mechanism: "knowledge_claims/knowledge_deadline_rules/etc. already require source_version_id NOT NULL." },
  { condition: "passage citation exists", enforcement: "database", mechanism: "knowledge_citations requires source_version_id and passage_id both NOT NULL already." },
  { condition: "jurisdiction resolved or explicitly unknown", enforcement: "application_or_governance", mechanism: "jurisdiction_id is nullable by schema design (PHASE 9C's unknown-fallback rule); 'explicitly unknown' vs 'not yet checked' is a governance distinction a CHECK cannot express." },
  { condition: "effective-date state valid or explicitly unknown", enforcement: "application_or_governance", mechanism: "Same nullable-by-design reasoning; validity-at-query-time is inherently a runtime computation, not a static constraint." },
  { condition: "required review completed", enforcement: "database", mechanism: "The transition RPC + review_record_id NOT NULL requirement on the relevant transition rows." },
  { condition: "high-risk review completed where applicable", enforcement: "application_or_governance", mechanism: "Which review LEVEL is 'applicable' depends on the underlying entity's risk_level, which the state machine itself does not encode — checked by the RPC against the entity's own risk_level column." },
  { condition: "no unresolved official-source conflict", enforcement: "database", mechanism: "knowledge_conflicts.blocks_high_risk_use / status columns already exist; the eligibility RPC queries them." },
  { condition: "no active suspension", enforcement: "database", mechanism: "current_state <> 'suspended' on knowledge_publication_states, checked by the transition-validation trigger itself." },
  { condition: "no withdrawal", enforcement: "database", mechanism: "current_state <> 'withdrawn', same mechanism." },
  { condition: "no newer current superseding unit", enforcement: "application_or_governance", mechanism: "Requires walking supersedes/superseded_by chains at query time; not a single-row constraint." },
  { condition: "required translation conditions satisfied for locale-specific publication", enforcement: "database", mechanism: "The partial unique index on knowledge_canonical_unit_translations enforces at most one current approved row per (entity,field,locale); presence/absence is a query, not a constraint on the claim itself." },
  { condition: "provenance complete", enforcement: "application_or_governance", mechanism: "'Complete' is a governance judgment about a chain of rows, not a single-table constraint." },
];

// ============================================================================
// PART A.7 — RUNTIME RETRIEVAL AND-GATE
// ============================================================================

const RUNTIME_RETRIEVAL_AND_GATE: readonly string[] = [
  "knowledge_publication_states.current_state = 'published' for the entity",
  "knowledge_publication_states.effective_from <= now() AND (effective_until IS NULL OR effective_until > now())",
  "a matching knowledge_retrieval_metadata row exists with full_text_indexed=true (or vector_indexed=true) and its four schema-fixed filter-required flags all true",
  "the underlying canonical row's own effective_from/effective_until is valid for query time (or the query is explicitly historical)",
  "jurisdiction is resolved (jurisdiction_id not null) or explicitly accepted as unresolved per the PHASE 9C fallback rule",
  "the cited source_version's freshness_status is not stale/expired, or historical_use_allowed=true and the query is explicitly historical",
  "no open/blocked knowledge_conflicts row with blocks_high_risk_use=true references this entity",
  "for the requested output_locale: an approved, non-invalidated knowledge_canonical_unit_translations row exists, or German fallback is used with an explicit warning",
  "the entity's required review level (per its own risk_level) has a matching human_reviewed/expert_reviewed knowledge_review_records row",
  "if the entity belongs to a process pack, the pack-level complete_process_pack_version publication state is not itself suspended or withdrawn",
];

const PUBLICATION_STATE_ALONE_ENABLES_RUNTIME = false;
const SMART_TALK_REMAINS_READ_ONLY = true;

// ============================================================================
// PART B.1 — GENERIC vs ENTITY-SPECIFIC TRANSLATION COMPARISON
// ============================================================================

interface TranslationTableComparisonCriterion {
  criterion: string;
  genericTable: string;
  entitySpecificTables: string;
  genericWins: boolean;
}

const TRANSLATION_TABLE_COMPARISON: readonly TranslationTableComparisonCriterion[] = [
  { criterion: "referential_integrity", genericTable: "Same polymorphic trigger-validated boundary as every other cross-cutting governance table in migration 032.", entitySpecificTables: "Real per-table FKs, marginally stronger per-table, but 8 separate FK targets to maintain instead of 1 dispatch function.", genericWins: true },
  { criterion: "field_extensibility", genericTable: "Adding a 9th translatable field is a data change (a new field_key value), not a schema change.", entitySpecificTables: "Adding a 9th translatable field means a 9th table (or a new column repeated 8 times).", genericWins: true },
  { criterion: "query_complexity", genericTable: "Slightly higher per-query (must filter by entity_type/field_key), but uniform across all callers.", entitySpecificTables: "Simpler per-entity queries, but 8 different query shapes for callers to learn.", genericWins: false },
  { criterion: "rls", genericTable: "One RLS policy set to design/maintain.", entitySpecificTables: "8 identical RLS policy sets to design/maintain/keep in sync.", genericWins: true },
  { criterion: "generated_types", genericTable: "One generated row type; entity_type/field_key are just strings, exactly like the existing entity_type columns already generate.", entitySpecificTables: "8 near-identical generated row types differing only in a target FK column name.", genericWins: true },
  { criterion: "review_workflow", genericTable: "One review workflow implementation serves every translatable unit.", entitySpecificTables: "8 near-duplicate review workflow implementations, or one implementation forced to branch 8 ways anyway.", genericWins: true },
  { criterion: "version_invalidation", genericTable: "One invalidation trigger, dispatching by entity_type, covers every unit.", entitySpecificTables: "8 near-duplicate invalidation triggers.", genericWins: true },
  { criterion: "indexability", genericTable: "A handful of well-chosen (entity_type, entity_id, field_key, output_locale) indexes cover every unit.", entitySpecificTables: "Marginally more targeted per-table indexes, but 8x the index-maintenance surface.", genericWins: false },
  { criterion: "orphan_reference_prevention", genericTable: "Identical trigger-validated boundary as the current-state table; no worse than entity-specific.", entitySpecificTables: "Real FKs prevent orphans more strongly per table.", genericWins: false },
  { criterion: "launch_and_future_language_support", genericTable: "A single output_locale CHECK constraint (already proven by knowledge_localized_terminology) covers every unit uniformly.", entitySpecificTables: "The same CHECK would have to be repeated 8 times, risking drift (e.g. one table's CHECK list falling out of sync with the others).", genericWins: true },
];

const GENERIC_TRANSLATION_TABLE_SELECTED = true;
const TRANSLATION_TABLE_COMPARISON_SCORE = {
  genericWinCount: TRANSLATION_TABLE_COMPARISON.filter((c) => c.genericWins).length,
  entitySpecificWinCount: TRANSLATION_TABLE_COMPARISON.filter((c) => !c.genericWins).length,
};

// ============================================================================
// PART B.2 — TRANSLATABLE UNIT MAPPING (derived from migration 032)
// ============================================================================

type TranslationMechanism = "new_generic_table" | "existing_terminology_table";

interface TranslatableUnitMapping {
  unitKind: string;
  mechanism: TranslationMechanism;
  canonicalTargetTable: string;
  canonicalTargetKey: string;
  fieldKey: string | null;
  canonicalContentVersioned: boolean;
  belongsToSpecificCanonicalVersion: boolean;
  jurisdictionInherited: boolean;
  effectiveDateInherited: boolean;
  publicationStateIndependentOrLinked: "linked" | "independent";
  note: string;
}

const TRANSLATABLE_UNIT_MAPPINGS: readonly TranslatableUnitMapping[] = [
  { unitKind: "claim_presentation_text", mechanism: "new_generic_table", canonicalTargetTable: "knowledge_claims", canonicalTargetKey: "id", fieldKey: "claim_text_canonical",
    canonicalContentVersioned: true, belongsToSpecificCanonicalVersion: true, jurisdictionInherited: true, effectiveDateInherited: true, publicationStateIndependentOrLinked: "linked",
    note: "Row-is-the-version, per PART A.2." },
  { unitKind: "process_title", mechanism: "new_generic_table", canonicalTargetTable: "knowledge_processes", canonicalTargetKey: "id", fieldKey: "title",
    canonicalContentVersioned: true, belongsToSpecificCanonicalVersion: true, jurisdictionInherited: true, effectiveDateInherited: true, publicationStateIndependentOrLinked: "linked", note: "" },
  { unitKind: "process_summary", mechanism: "new_generic_table", canonicalTargetTable: "knowledge_processes", canonicalTargetKey: "id", fieldKey: "trigger_description",
    canonicalContentVersioned: true, belongsToSpecificCanonicalVersion: true, jurisdictionInherited: true, effectiveDateInherited: true, publicationStateIndependentOrLinked: "linked",
    note: "migration 032 has no dedicated 'summary' column; trigger_description is the closest actual existing free-text field. safe_first_step is an additional field_key the generic design also supports for free, though not explicitly required by this phase." },
  { unitKind: "process_step_title", mechanism: "new_generic_table", canonicalTargetTable: "knowledge_process_steps", canonicalTargetKey: "id", fieldKey: "title",
    canonicalContentVersioned: true, belongsToSpecificCanonicalVersion: true, jurisdictionInherited: true, effectiveDateInherited: true, publicationStateIndependentOrLinked: "linked", note: "" },
  { unitKind: "process_step_explanation", mechanism: "new_generic_table", canonicalTargetTable: "knowledge_process_steps", canonicalTargetKey: "id", fieldKey: "description_canonical",
    canonicalContentVersioned: true, belongsToSpecificCanonicalVersion: true, jurisdictionInherited: true, effectiveDateInherited: true, publicationStateIndependentOrLinked: "linked", note: "" },
  { unitKind: "warning_text", mechanism: "existing_terminology_table", canonicalTargetTable: "knowledge_terminology", canonicalTargetKey: "id", fieldKey: null,
    canonicalContentVersioned: false, belongsToSpecificCanonicalVersion: false, jurisdictionInherited: false, effectiveDateInherited: false, publicationStateIndependentOrLinked: "independent",
    note: "Warning message templates are fixed, claim-independent governance text, already fully representable via the EXISTING knowledge_terminology (canonical_german_term/definition_canonical) + knowledge_localized_terminology (output_locale, warnings_equivalent, etc.) tables from migration 032. No new table needed for this unit kind." },
  { unitKind: "document_requirement_presentation_text", mechanism: "new_generic_table", canonicalTargetTable: "knowledge_evidence_requirements", canonicalTargetKey: "id", fieldKey: "description_canonical",
    canonicalContentVersioned: true, belongsToSpecificCanonicalVersion: true, jurisdictionInherited: true, effectiveDateInherited: true, publicationStateIndependentOrLinked: "linked",
    note: "knowledge_form_requirements has no free-text presentation column; knowledge_evidence_requirements.description_canonical is the correct actual target." },
  { unitKind: "deadline_explanation_text", mechanism: "new_generic_table", canonicalTargetTable: "knowledge_process_steps", canonicalTargetKey: "id", fieldKey: "description_canonical",
    canonicalContentVersioned: true, belongsToSpecificCanonicalVersion: true, jurisdictionInherited: true, effectiveDateInherited: true, publicationStateIndependentOrLinked: "linked",
    note: "knowledge_deadline_rules itself has no free-text explanation column and none is proposed here (to stay maximally additive on existing tables); every deadline_rule is only ever referenced via knowledge_process_steps.deadline_rule_id, so the referencing step's own description_canonical serves as its contextual explanation." },
  { unitKind: "authority_resolution_guidance", mechanism: "new_generic_table", canonicalTargetTable: "knowledge_authority_competences", canonicalTargetKey: "id", fieldKey: "subject_matter",
    canonicalContentVersioned: true, belongsToSpecificCanonicalVersion: true, jurisdictionInherited: true, effectiveDateInherited: true, publicationStateIndependentOrLinked: "linked",
    note: "knowledge_authority_competences has no dedicated guidance column; subject_matter (text, not null) is the closest actual existing free-text field." },
  { unitKind: "outcome_guidance", mechanism: "existing_terminology_table", canonicalTargetTable: "knowledge_terminology", canonicalTargetKey: "id", fieldKey: null,
    canonicalContentVersioned: false, belongsToSpecificCanonicalVersion: false, jurisdictionInherited: false, effectiveDateInherited: false, publicationStateIndependentOrLinked: "independent",
    note: "Same reasoning as warning_text: outcome guidance is fixed structural vocabulary, already representable via the existing terminology tables." },
];

const NEW_TABLE_TRANSLATABLE_ENTITY_TYPES: readonly string[] = Array.from(
  new Set(
    TRANSLATABLE_UNIT_MAPPINGS.filter((m) => m.mechanism === "new_generic_table").map((m) => {
      switch (m.canonicalTargetTable) {
        case "knowledge_claims": return "claim";
        case "knowledge_processes": return "process";
        case "knowledge_process_steps": return "process_step";
        case "knowledge_evidence_requirements": return "evidence_requirement";
        case "knowledge_authority_competences": return "authority_competence";
        default: return "unknown";
      }
    })
  )
);

// ============================================================================
// PART B.3 — TRANSLATION TABLE CONTRACT
// ============================================================================

const TRANSLATION_STATUSES = [
  "draft", "machine_generated_pending_review", "human_review_pending", "approved",
  "rejected", "invalidated_pending_review", "superseded", "withdrawn",
] as const;
type TranslationStatus = (typeof TRANSLATION_STATUSES)[number];

interface TranslationTransitionSpec { from: TranslationStatus; to: TranslationStatus; rationale: string }

const TRANSLATION_ALLOWED_TRANSITIONS: readonly TranslationTransitionSpec[] = [
  { from: "draft", to: "machine_generated_pending_review", rationale: "Machine-authored candidate awaiting human review." },
  { from: "draft", to: "human_review_pending", rationale: "Human-authored translation awaiting review." },
  { from: "machine_generated_pending_review", to: "human_review_pending", rationale: "Promoted into the same human-review queue as any other candidate." },
  { from: "human_review_pending", to: "approved", rationale: "Reviewer approves; gated by the database CHECK requiring uncertainty/warning/numeric preservation and human_reviewed=true." },
  { from: "human_review_pending", to: "rejected", rationale: "Reviewer rejects; row retained permanently, never mutated further." },
  { from: "approved", to: "invalidated_pending_review", rationale: "Triggered synchronously by a change to the underlying German canonical content." },
  { from: "approved", to: "superseded", rationale: "A newer translation_version for the same key reached approved." },
  { from: "invalidated_pending_review", to: "human_review_pending", rationale: "Re-review after invalidation." },
  { from: "invalidated_pending_review", to: "withdrawn", rationale: "The underlying German canonical unit itself was withdrawn." },
  { from: "approved", to: "withdrawn", rationale: "The underlying German canonical unit itself was withdrawn." },
];

const TRANSLATION_TERMINAL_STATUSES: readonly TranslationStatus[] = TRANSLATION_STATUSES.filter(
  (s) => !TRANSLATION_ALLOWED_TRANSITIONS.some((t) => t.from === s)
);

const TRANSLATION_TABLE_FIELD_DECISIONS: readonly FieldDecision[] = [
  { field: "id", included: true, typeContract: "uuid primary key default gen_random_uuid()", rationale: "Standard." },
  { field: "entity_type / entity_id", included: true, typeContract: "text not null check (in <5 new-table entity types>) / uuid not null", rationale: "Polymorphic reference to the German canonical unit being translated." },
  { field: "canonical_version_id", included: false, typeContract: "n/a — rejected in favor of canonical_content_fingerprint", rationale: "None of the 5 target tables has a separate version table (unlike knowledge_source_versions); each row IS its own version via row-level supersession. A literal 'canonical_version_id' FK has no real target, so it is replaced by a content fingerprint (see below), which is both simpler and stronger." },
  { field: "canonical_content_fingerprint", included: true, typeContract: "text not null — sha256 hex of the exact translated field's text content at translation time", rationale: "Mirrors the existing knowledge_source_versions.content_hash precedent; detects BOTH a proper supersession and an improper in-place edit of the canonical column, since the schema does not itself forbid the latter on these 5 tables." },
  { field: "field_key", included: true, typeContract: "text not null check (field_key in <the 6 actual field keys used>)", rationale: "Scoped by entity_type context (e.g. 'title' means different things for process vs process_step)." },
  { field: "output_locale", included: true, typeContract: "text not null check (output_locale in <5 non-German launch locales>)", rationale: "Deliberately EXCLUDES 'de': German is never stored as an independent translation of itself in this table (see LANGUAGE_REPRESENTATION_DECISION)." },
  { field: "translated_text", included: true, typeContract: "text not null", rationale: "Standard." },
  { field: "translation_version", included: true, typeContract: "integer not null default 1 check (translation_version > 0)", rationale: "Increments on a new attempt for the same key; old rows are never mutated to represent a new attempt." },
  { field: "status", included: true, typeContract: "translation_status text not null default 'draft' check (in <8 statuses>)", rationale: "See TRANSLATION_STATUSES." },
  { field: "reviewer_state", included: false, typeContract: "n/a — rejected", rationale: "Redundant with review_record_id, which already references the full knowledge_review_records row (reviewer_type/reason/notes) — a duplicate free-text field would just drift out of sync with it." },
  { field: "machine_generated", included: true, typeContract: "boolean not null default false", rationale: "Standard." },
  { field: "machine_provider / machine_model", included: true, typeContract: "text nullable each, check (not machine_generated or machine_provider is not null) and equivalently for machine_model", rationale: "Conditionally-required via a same-row CHECK (Postgres CHECK constraints may reference multiple columns of the same row), not a trigger." },
  { field: "machine_run_reference", included: true, typeContract: "text nullable", rationale: "Free-text job/run identifier for audit tracing." },
  { field: "terminology_glossary_version_id (renamed glossary_snapshot_reference)", included: true, typeContract: "text nullable", rationale: "migration 032's knowledge_terminology rows have no version number of their own, so there is no real 'glossary version' id to reference; a free-text snapshot tag is the honest, schema-consistent representation." },
  { field: "uncertainty_preserved / warnings_preserved / numeric_and_deadline_values_preserved", included: true, typeContract: "boolean not null default false each", rationale: "Three distinct preservation facts (the prompt separates 'uncertainty/warning' preservation from 'deadline/number' preservation); all three are required true (via CHECK) before translation_status may reach 'approved'." },
  { field: "jurisdiction_inherited / effective_date_inherited", included: true, typeContract: "boolean not null default true check (= true) each", rationale: "Schema-enforced invariant, mirroring the EXACT existing pattern of knowledge_localized_terminology.official_german_term_retained boolean not null default true check (= true). Translations can never independently set jurisdiction or effective date." },
  { field: "human_reviewed", included: true, typeContract: "boolean not null default false", rationale: "Required true (via CHECK) before status may reach 'approved', together with review_record_id being non-null." },
  { field: "created_by (renamed created_by_actor_type + created_by_identifier)", included: true, typeContract: "text not null / text nullable", rationale: "Same actor-type convention as Part A, not a bare uuid with no FK target." },
  { field: "reviewed_by (renamed reviewed_by_actor_type + reviewed_by_identifier)", included: true, typeContract: "text nullable / text nullable", rationale: "Same convention; also compared against created_by_identifier at the RPC layer to enforce self-approval restriction." },
  { field: "created_at", included: true, typeContract: "timestamptz not null default now()", rationale: "Standard." },
  { field: "verified_at", included: true, typeContract: "timestamptz nullable, set when status reaches 'approved'", rationale: "Also the trigger boundary: once set, translated_text/entity_type/entity_id/field_key/output_locale/canonical_content_fingerprint/translation_version become immutable (mirrors knowledge_source_versions_protect_locked_content exactly)." },
  { field: "superseded_at", included: true, typeContract: "timestamptz nullable", rationale: "Set when a newer translation_version for the same key becomes approved." },
  { field: "invalidated_at", included: true, typeContract: "timestamptz nullable", rationale: "Set synchronously by the canonical-change trigger." },
  { field: "rejection_reason", included: true, typeContract: "text nullable, check (translation_status <> 'rejected' or rejection_reason is not null)", rationale: "Database-enforced, not merely documented." },
  { field: "provenance metadata (renamed provenance_note)", included: true, typeContract: "text nullable", rationale: "Same jsonb-avoidance rationale as Part A." },
];

const TRANSLATION_TABLE_NAME_CANDIDATE = "knowledge_canonical_unit_translations";

const MACHINE_AUTO_APPROVAL_BLOCKING_CHECK =
  "check (translation_status <> 'approved' or (uncertainty_preserved = true and warnings_preserved = true and numeric_and_deadline_values_preserved = true and human_reviewed = true and review_record_id is not null))";

const TRANSLATION_TABLE_DESIGN = {
  name: TRANSLATION_TABLE_NAME_CANDIDATE,
  purpose: "One row per (entity_type, entity_id, field_key, output_locale, translation_version): the translated text plus full governance metadata.",
  fields: TRANSLATION_TABLE_FIELD_DECISIONS,
  primaryKey: "id",
  checkConstraints: [
    "entity_type in <5 new-table entity types>", "output_locale in <5 non-German launch locales>",
    "translation_status in <8 statuses>", "translation_version > 0",
    "jurisdiction_inherited = true", "effective_date_inherited = true",
    "not machine_generated or machine_provider is not null", "not machine_generated or machine_model is not null",
    "translation_status <> 'rejected' or rejection_reason is not null",
    MACHINE_AUTO_APPROVAL_BLOCKING_CHECK,
  ],
  immutabilityTrigger: "knowledge_canonical_unit_translations_protect_verified_content — mirrors knowledge_source_versions_protect_locked_content exactly; once verified_at is set, content/identity columns cannot be mutated, only status/timestamp/reviewer columns via validated transitions.",
  isDesignCandidateOnly: true,
} as const;

const LANGUAGE_REPRESENTATION_DECISION = {
  germanStoredAsIndependentTranslationOfItself: false,
  decision: "output_locale on knowledge_canonical_unit_translations is CHECK-constrained to the 5 non-German launch locales only (en, sk, cs, pl, hu); 'de' is deliberately excluded because the German canonical text already lives directly on the source tables (knowledge_claims.claim_text_canonical etc.) — introducing a German row here would create exactly the independent-legal-truth risk the design must prevent.",
  supportedLaunchLanguageCountStillSix: true,
  englishOrSlovakTreatedAsCanonicalTruth: false,
  futureLocalesActivatedAutomatically: false,
  localeUsedForJurisdiction: false,
} as const;

// ============================================================================
// PART B.4 — CANONICAL-VERSION BINDING, INVALIDATION, FALLBACK, UNIQUENESS
// ============================================================================

const CANONICAL_VERSION_BINDING = {
  strategy: "canonical_content_fingerprint (sha256 of the exact translated field's text at translation time), not a nonexistent canonical_version_id column.",
  fingerprintStrategy: "Deterministic sha256 over the normalized field text, mirroring knowledge_source_versions.content_hash.",
  invalidationWhenGermanContentChanges: "A trigger on the 5 canonical tables re-fingerprints the relevant field on every UPDATE and, if it differs from any approved translation's stored fingerprint, flips that translation's status to invalidated_pending_review and sets invalidated_at.",
  historicalQueryBehavior: "Invalidated/superseded translation rows are never deleted; a historical-query flag permits retrieving them explicitly.",
  preventionOfTranslationAttachmentToWrongVersion: "The fingerprint comparison at read time rejects serving a translation whose fingerprint no longer matches the live canonical content, regardless of how the mismatch occurred.",
  preventionOfIndependentTranslationTruth: "jurisdiction_inherited/effective_date_inherited are schema-fixed true, and the fingerprint mechanism ties every translation back to one exact German text state.",
} as const;

const CANONICAL_CHANGE_INVALIDATION_APPROACH = "synchronous" as const;
const CANONICAL_CHANGE_INVALIDATION_JUSTIFICATION =
  "Synchronous (within the same transaction that changes the canonical content) is selected over queued/fail-closed-hybrid because an async queue would create a window in which a now-stale but still-approved translation could be served to a real user between the German change and queue processing — unacceptable under the evidence-before-claim and no-independent-legal-truth principles. A single trigger achieves the same guarantee for free, with no additional operational component (queue/worker) to build or fail.";

const FALLBACK_TIERS = [
  { tier: 1, description: "Approved, non-invalidated requested-locale translation." },
  { tier: 2, description: "German canonical presentation text directly from the source table." },
  { tier: 3, description: "Blocked / explicitly-untranslated state if the German presentation itself is unavailable or unapproved." },
] as const;

const UNAPPROVED_TRANSLATION_FALLBACK_ALLOWED = false;
const WARNING_AND_UNCERTAINTY_PARITY_PRESERVED_ACROSS_FALLBACK = true;

const TRANSLATION_UNIQUENESS_DESIGN = {
  fullHistoryUniqueConstraint: "unique(entity_type, entity_id, field_key, output_locale, translation_version)",
  currentApprovedUniqueConstraint: "unique partial index on (entity_type, entity_id, field_key, output_locale) where translation_status = 'approved' and superseded_at is null and invalidated_at is null",
  preservesHistoricalVersions: true,
  preventsTwoSimultaneousCurrentApprovedRows: true,
} as const;

// ============================================================================
// PART C — REFERENTIAL INTEGRITY
// ============================================================================

interface ReferenceOption {
  option: "polymorphic_entity_type_entity_id" | "explicit_nullable_foreign_keys" | "canonical_unit_registry_table";
  description: string;
  selected: boolean;
}

const REFERENCE_OPTIONS: readonly ReferenceOption[] = [
  { option: "polymorphic_entity_type_entity_id",
    description: "Matches the EXISTING, explicitly self-documented convention already used by knowledge_review_records, knowledge_freshness_records, knowledge_audit_events, knowledge_trust_domain_links and knowledge_retrieval_metadata in migration 032 — including that same migration's own comment acknowledging entity-id integrity is an application/governance responsibility, not a false FK claim.",
    selected: true },
  { option: "explicit_nullable_foreign_keys",
    description: "Would require one nullable FK column per possible target table (12 for publication, 5 for translation) on each new table — most columns null for any given row; rejected as sparse and harder to extend than a single entity_type/entity_id pair.",
    selected: false },
  { option: "canonical_unit_registry_table",
    description: "See CANONICAL_UNIT_REGISTRY_ASSESSMENT below.",
    selected: false },
];

const CANONICAL_UNIT_REGISTRY_ASSESSMENT = {
  purpose: "One stable identity across heterogeneous canonical entities; a strong FK target for publication states and translations; simplified retrieval joins; avoidance of orphan polymorphic references.",
  benefit: "Stronger real-FK orphan prevention than the trigger-validated dispatch boundary.",
  migrationCost: "High: requires either adding a registry-linking column to some or all of the 17 target tables (claim/process/process_step/evidence_requirement/authority_competence/source/source_version/deadline_rule/terminology, etc.), or a separate synchronization trigger on each — a materially larger footprint than the trigger-validated dispatch this design already proposes.",
  duplicationRisk: "Every canonical row would need a mirrored registry row, doubling the write path for those tables.",
  synchronizationComplexity: "A trigger on every target table would be needed to keep the registry in sync going forward — more moving parts than the single dispatch-validation trigger this design already uses.",
  impactOnExisting33Tables: "Would touch existing tables' structure (even if only additive columns/triggers), a materially larger footprint than adding two brand-new, fully self-contained tables.",
  backfillIfAdoptedNow: "None needed today (all 33 tables are confirmed empty per PHASE 9H), but the migration-cost/duplication/sync concerns above stand independently of backfill cost.",
  requiredBeforeFirstIngestion: false,
  decision: "optional_later" as const,
  justification: "Not required now: the trigger-validated dispatch boundary already prevents orphan references for the fixed, small, known set of 12/5 entity types this design needs. A registry could be introduced additively later — without disrupting anything proposed here, since entity_id values remain stable — only if operational experience later shows the trigger-validated boundary is insufficient.",
};

const CANONICAL_UNIT_REGISTRY_REQUIRED = false;

const POLYMORPHIC_VALIDATION_BOUNDARY = {
  mechanism: "BEFORE INSERT/UPDATE trigger dispatching on entity_type via a fixed CASE/IF list, running one targeted `EXISTS (SELECT 1 FROM <the one correct table> WHERE id = entity_id)` check per known entity_type.",
  limitation: "This is a trigger-enforced application boundary, not a true multi-target PostgreSQL foreign key — PostgreSQL cannot express 'this column may reference any one of N different tables' as a single FK. This limitation is stated explicitly rather than claimed away.",
} as const;

// ─── Process-pack version identity ──────────────────────────────────────────

const PROCESS_PACK_VERSION_IDENTITY = {
  packIdentity: FIRST_PROCESS_PACK_ID,
  packVersionIdentity: "Not a separate stored row: a pack 'version' is the snapshot of which specific knowledge_processes row-ids (one per anmeldung/ummeldung/abmeldung variant) are currently status='active' for process_group_id='anmeldung_ummeldung_abmeldung', combined with the newest effective_from among them — computed at query time, not stored.",
  constituentCanonicalUnits: ["the 3 variant knowledge_processes rows", "their knowledge_process_steps", "the knowledge_claims linked via knowledge_process_claim_links", "linked document/deadline/authority units"],
  constituentVersionReferences: "Each constituent is referenced by its own row id; there is no separate pack-version table duplicating those references.",
  jurisdictionScope: "Union of the jurisdiction_id/territorial_scope_id values across the 3 variants plus any knowledge_regional_overrides.",
  effectiveTimeScope: "Intersection-aware: the pack is considered effective only where at least one variant is effective at query time.",
  completenessGate: "Application-computed: all 3 variants (or the applicable subset) at human_reviewed or better, with no open blocking conflicts.",
  publicationStateAnchor: "entity_type='complete_process_pack_version' with entity_id = the anmeldung variant's knowledge_processes.id, chosen as the pack's stable anchor since anmeldung is the pack's primary/first-listed variant. Using the SAME id with a DIFFERENT entity_type from the anmeldung variant's own entity_type='process' publication-state row is valid and unambiguous because uniqueness is enforced on the (entity_type, entity_id) PAIR, not on entity_id alone.",
  translationCompleteness: "Application-computed across the constituent units' own translation coverage per locale.",
  supersession: "Follows the standard publication supersession model at the pack-anchor entity.",
  withdrawal: "Follows the standard publication withdrawal model at the pack-anchor entity; does not itself withdraw the 3 underlying variant rows, which retain their own independent publication states.",
  runtimeRetrievalRelationship: "Compositional AND-gate condition 10: a unit belonging to this pack is retrievable only if BOTH its own publication state AND the pack-anchor's publication state permit it.",
  noRealPackDataPopulated: true,
} as const;

// ============================================================================
// PART D — RLS, GRANTS AND SECURITY
// ============================================================================

const RLS_AND_GRANTS_DESIGN = {
  allProposedTablesHaveRls: true,
  failClosedByDefault: true,
  anonDirectWritesAllowed: false,
  authenticatedDirectWritesAllowed: false,
  publicDirectReadsAllowed: false,
  serviceRoleMayWriteDirectly: false,
  onlySecurityDefinerRpcsMayTransitionState: true,
  internalBackendRoleRequired: "A dedicated, narrowly-scoped Postgres role (e.g. knowledge_governance_writer) owns the security-definer RPC functions; even service_role's normal RLS-bypass is not relied upon for direct table writes, keeping the privilege surface as small as possible.",
  privilegeSurfaceRationale: "A bare service_role INSERT/UPDATE grant would bypass RLS but would NOT by itself enforce the adjacency-list/evidence/reason/concurrency business rules — only function logic inside a security-definer RPC can enforce those atomically, so direct grants are revoked even from service_role's ordinary table-privilege path.",
} as const;

interface RpcContractSpec {
  name: string;
  validates: readonly string[];
}

const PUBLICATION_TRANSITION_RPC: RpcContractSpec = {
  name: "knowledge_transition_publication_state (design candidate; not implemented in this phase)",
  validates: [
    "actor role", "current state (re-read inside the same transaction)", "requested transition against ALLOWED_TRANSITIONS",
    "required evidence per PUBLICATION_ELIGIBILITY_GATE", "required reviews (review_record_id presence for gated transitions)",
    "reason (transition_reason_code, restricted subset for suspend/withdraw)", "concurrency via state_version match",
    "target existence via the polymorphic validation boundary", "target not already withdrawn",
    "supersession reference presence where requiresSupersedingReference is true", "emergency authorization where emergency_flag=true",
  ],
};

const TRANSLATION_AUTHORIZATION_RPCS: readonly RpcContractSpec[] = [
  { name: "knowledge_create_translation_candidate (machine or human candidate creation; design candidate only)",
    validates: ["actor_type is 'automation' (machine) or a recognized human translator role", "status starts at draft/machine_generated_pending_review only", "canonical_content_fingerprint computed from the live canonical row"] },
  { name: "knowledge_submit_translation_for_review (human translation editing; design candidate only)",
    validates: ["actor is a human translator role", "status transitions to human_review_pending only"] },
  { name: "knowledge_review_translation (translation review + approval/rejection; design candidate only)",
    validates: ["actor is translation_reviewer role", "actor identity differs from created_by_identifier (self-approval blocked)", "uncertainty/warnings/numeric preservation booleans set true before approval", "rejection_reason present before rejection"] },
  { name: "knowledge_invalidate_translations_on_canonical_change (system-only; design candidate only)",
    validates: ["fires only from the canonical-change trigger, never from a human-facing endpoint", "only ever moves approved -> invalidated_pending_review"] },
  { name: "knowledge_withdraw_translation (cascades from underlying-unit withdrawal; design candidate only)",
    validates: ["only callable as part of the SAME transaction as the underlying canonical unit's own withdrawal transition"] },
];

const TRANSLATION_PERMISSION_SEPARATION = {
  distinctPermissions: [
    "machine_candidate_creation", "human_translation_editing", "translation_review",
    "translation_approval (folded into translation_review's approve action; requires the translation_reviewer role specifically)",
    "translation_invalidation (system-only, never a human action)", "withdrawal (cascaded from the underlying unit's own withdrawal, not an independent translation action)",
  ] as const,
  oneActorAutomaticallyGainsEveryPermission: false,
};

const DIRECT_TABLE_WRITES_DECISION = {
  revokedEvenFromOrdinaryAuthenticatedInternalUsers: true,
  allowedPrivilegedActor: "Only the security-definer RPC functions, owned by the dedicated knowledge_governance_writer role.",
  intendedRpcBoundary: "knowledge_transition_publication_state + the 5 translation RPCs listed above; no other write path exists.",
  auditLogging: "Every successful RPC call inserts a knowledge_audit_events row in the SAME transaction as the state/content change.",
  transactionHandling: "Each RPC call is a single transaction; any validation failure raises an exception and the whole transaction rolls back — no partial state.",
  failureBehavior: "PostgreSQL exception, transaction aborted, caller receives an error; no silent partial success.",
} as const;

// ============================================================================
// PART E — APPEND-ONLY AND IMMUTABILITY
// ============================================================================

const APPEND_ONLY_DESIGN = {
  insertOnlyTables: [TRANSITION_HISTORY_TABLE_NAME_CANDIDATE] as const,
  controlledUpdateTables: [CURRENT_STATE_TABLE_NAME_CANDIDATE, TRANSLATION_TABLE_NAME_CANDIDATE] as const,
  columnsImmutableAfterApproval: [
    "knowledge_publication_state_transitions: every column, unconditionally, from the moment of insertion",
    "knowledge_canonical_unit_translations: translated_text/entity_type/entity_id/field_key/output_locale/canonical_content_fingerprint/translation_version, once verified_at is set",
  ] as const,
  correctionsRepresentedAs: "New rows only: rollback_of_transition_id for publication corrections; translation_version increments for translation corrections. Never an in-place edit of content.",
  mistakenTransitionsReversedWithoutEditingHistory: "A new corrective transition is inserted pointing at the mistaken one via rollback_of_transition_id; the mistaken row itself is untouched forever.",
  rejectedTranslationsRetained: "Never deleted; translation_status='rejected' remains permanently on that row. A revision is a new row at translation_version+1.",
  cleanupDifferenceSyntheticVsReal: "Synthetic/dry-run rows (as used in PHASE 9J's controlled local-only write dry-run) may be deleted by an explicit, narrowly-scoped cleanup script BEFORE any row ever reaches human_reviewed=true or a genuinely published state. Once any row has reached that point for real data, routine deletion is forbidden; only suspension/withdrawal plus a forward migration are acceptable.",
  realProductionHistoryNeverDeletedAsRoutineRollback: true,
} as const;

// ============================================================================
// PART F — INDEX AND QUERY DESIGN
// ============================================================================

interface IndexSpec {
  table: string;
  columns: readonly string[];
  predicate: string | null;
  unique: boolean;
  querySupported: string;
  writeCostJustification: string;
}

const PROPOSED_INDEXES: readonly IndexSpec[] = [
  { table: CURRENT_STATE_TABLE_NAME_CANDIDATE, columns: ["entity_type", "entity_id"], predicate: null, unique: true,
    querySupported: "current state by entity; also enforces one-row-per-subject", writeCostJustification: "One row per subject; negligible write cost, required for correctness." },
  { table: CURRENT_STATE_TABLE_NAME_CANDIDATE, columns: ["current_state"], predicate: null, unique: false,
    querySupported: "currently published entities / suspended entities (filter by value)", writeCostJustification: "Small, fixed-cardinality column; cheap to maintain." },
  { table: CURRENT_STATE_TABLE_NAME_CANDIDATE, columns: ["entity_type", "entity_id"], predicate: "where current_state = 'review_required'", unique: false,
    querySupported: "entities requiring review", writeCostJustification: "Partial index keeps the common non-review-required case free of index-maintenance cost." },
  { table: CURRENT_STATE_TABLE_NAME_CANDIDATE, columns: ["jurisdiction_id"], predicate: null, unique: false,
    querySupported: "publication scope and jurisdiction filters", writeCostJustification: "jurisdiction_id is set on a minority of rows (override-only); cheap." },
  { table: TRANSITION_HISTORY_TABLE_NAME_CANDIDATE, columns: ["entity_type", "entity_id", "transitioned_at"], predicate: null, unique: false,
    querySupported: "transition history by entity, ordered", writeCostJustification: "Append-only table; one index write per insert, no update cost ever." },
  { table: TRANSITION_HISTORY_TABLE_NAME_CANDIDATE, columns: ["transitioned_at"], predicate: null, unique: false,
    querySupported: "transitions by timestamp (global monitoring)", writeCostJustification: "Same append-only reasoning." },
  { table: TRANSITION_HISTORY_TABLE_NAME_CANDIDATE, columns: ["entity_type", "entity_id"], predicate: "where emergency_flag = true", unique: false,
    querySupported: "emergency transitions", writeCostJustification: "Partial index; emergency transitions are rare, so the index stays small." },
  { table: TRANSITION_HISTORY_TABLE_NAME_CANDIDATE, columns: ["to_state"], predicate: "where to_state = 'superseded'", unique: false,
    querySupported: "supersession lookups", writeCostJustification: "Partial index on a rare state keeps it small." },
  { table: TRANSLATION_TABLE_NAME_CANDIDATE, columns: ["entity_type", "entity_id", "field_key", "output_locale"], predicate: "where translation_status = 'approved' and superseded_at is null and invalidated_at is null", unique: true,
    querySupported: "current approved translation by entity/field/locale — THE critical uniqueness index", writeCostJustification: "Partial+unique keeps the common historical-row case out of this index entirely; only ever at most one live row per key participates." },
  { table: TRANSLATION_TABLE_NAME_CANDIDATE, columns: ["entity_type", "entity_id", "field_key", "output_locale", "translation_version"], predicate: null, unique: true,
    querySupported: "all historical translations, version-unique", writeCostJustification: "One row per version; required for correctness, unavoidable write cost." },
  { table: TRANSLATION_TABLE_NAME_CANDIDATE, columns: ["translation_status"], predicate: "where translation_status in ('human_review_pending', 'machine_generated_pending_review')", unique: false,
    querySupported: "translations requiring review", writeCostJustification: "Partial index; only pending rows are indexed." },
  { table: TRANSLATION_TABLE_NAME_CANDIDATE, columns: ["invalidated_at"], predicate: "where invalidated_at is not null", unique: false,
    querySupported: "invalidated translations", writeCostJustification: "Partial index; only invalidated rows are indexed." },
  { table: TRANSLATION_TABLE_NAME_CANDIDATE, columns: ["machine_generated"], predicate: "where translation_status = 'machine_generated_pending_review'", unique: false,
    querySupported: "machine-generated pending review", writeCostJustification: "Partial index on a narrow, operationally important queue." },
  { table: TRANSLATION_TABLE_NAME_CANDIDATE, columns: ["glossary_snapshot_reference"], predicate: null, unique: false,
    querySupported: "glossary-version usage lookups", writeCostJustification: "Nullable text column; low cardinality write cost." },
  { table: TRANSLATION_TABLE_NAME_CANDIDATE, columns: ["output_locale"], predicate: null, unique: false,
    querySupported: "locale coverage for a process pack", writeCostJustification: "Fixed small cardinality (5 values); cheap." },
];

// ============================================================================
// PART G — MIGRATION AND ROLLBACK BOUNDARY
// ============================================================================

interface NewTableCandidate {
  name: string;
  purpose: string;
  fieldCount: number;
}

const NEW_TABLE_CANDIDATES: readonly NewTableCandidate[] = [
  { name: CURRENT_STATE_TABLE_NAME_CANDIDATE, purpose: CURRENT_STATE_TABLE_DESIGN.purpose, fieldCount: CURRENT_STATE_FIELD_DECISIONS.filter((f) => f.included).length },
  { name: TRANSITION_HISTORY_TABLE_NAME_CANDIDATE, purpose: TRANSITION_HISTORY_TABLE_DESIGN.purpose, fieldCount: TRANSITION_HISTORY_FIELD_DECISIONS.length },
  { name: TRANSLATION_TABLE_NAME_CANDIDATE, purpose: TRANSLATION_TABLE_DESIGN.purpose, fieldCount: TRANSLATION_TABLE_FIELD_DECISIONS.filter((f) => f.included).length },
];

const PROPOSED_FUNCTIONS_AND_TRIGGERS = [
  "knowledge_publication_state_transitions_append_only() — BEFORE UPDATE OR DELETE trigger, unconditional rejection",
  "knowledge_publication_states_validate_transition() — BEFORE INSERT/UPDATE trigger validating current_transition_id.to_state = current_state and target existence",
  "knowledge_canonical_unit_translations_protect_verified_content() — BEFORE UPDATE trigger, mirrors knowledge_source_versions_protect_locked_content",
  "knowledge_canonical_change_invalidates_translations() — trigger on the 5 canonical target tables, synchronous invalidation",
  "knowledge_transition_publication_state(...) — security-definer RPC",
  "knowledge_create_translation_candidate / knowledge_submit_translation_for_review / knowledge_review_translation / knowledge_invalidate_translations_on_canonical_change / knowledge_withdraw_translation — security-definer RPCs",
] as const;

const MIGRATION_BOUNDARY_9K = {
  proposedNewTables: NEW_TABLE_CANDIDATES.map((t) => t.name),
  proposedCheckDomains: [
    `${CURRENT_STATE_TABLE_NAME_CANDIDATE}.current_state in <9 states>`,
    `${TRANSITION_HISTORY_TABLE_NAME_CANDIDATE}.to_state/from_state in <9 states>`,
    `${TRANSITION_HISTORY_TABLE_NAME_CANDIDATE}.transition_reason_code in <16 codes>`,
    `${TRANSLATION_TABLE_NAME_CANDIDATE}.translation_status in <8 statuses>`,
    `${TRANSLATION_TABLE_NAME_CANDIDATE}.output_locale in <5 non-German launch locales>`,
  ],
  proposedFunctionsAndTriggers: PROPOSED_FUNCTIONS_AND_TRIGGERS,
  proposedIndexes: PROPOSED_INDEXES.length,
  proposedRls: "RLS enabled on all 3 new tables, zero anon/authenticated policies — identical to all 33 existing tables.",
  proposedGrantsRevokes: "revoke all on the 3 new tables from public, anon, authenticated — matching every existing revoke statement in migration 032.",
  optionalRegistryTableDecision: CANONICAL_UNIT_REGISTRY_ASSESSMENT.decision,
  noDataBackfillInSchemaCreationMigration: true,
  noProductionApplicationInSamePhase: true,
  noRealRowsInsertedInSamePhase: true,
  noDestructiveChangeToExisting33Tables: true,
} as const;

const MIGRATION_TIME_BACKFILL_REQUIRED = false;
const BACKFILL_JUSTIFICATION =
  "All 33 existing knowledge_* tables are confirmed EMPTY (PHASE 9H verified fact), so there are zero existing rows needing an initial publication-state/translation row backfilled at migration time. Going forward, publication-state creation is designed to be BUNDLED with each canonical row's own creation flow (the initial null->draft transition is inserted in the same transaction as the canonical row), so a later retrofit backfill is structurally avoided too. Publication-state initialization is therefore distinct from, and does not require, either migration-time backfill or later controlled data population as a separate step.";

const ROLLBACK_BOUNDARY = {
  beforeRealRowsExist: "Dropping the 3 new tables entirely is a trivially safe rollback; nothing references them.",
  afterDraftRowsExist: "If only synthetic/dry-run rows exist (per PHASE 9J's controlled local-only write dry-run), rollback = an explicit cleanup script deleting those specific rows, or dropping the tables if the whole extension is abandoned — still safe since nothing is real.",
  afterPublishedRowsExist: "Dropping the extension is explicitly NOT an acceptable normal rollback once real published history exists. Use suspension/withdrawal transitions plus a forward (additive) migration instead.",
  destructiveDropAcceptableAfterPublication: false,
} as const;

// ============================================================================
// PART H — FIRST-PACK COMPATIBILITY
// ============================================================================

interface CompatibilityCheck { item: string; supported: boolean; justification: string }

const FIRST_PACK_COMPATIBILITY: readonly CompatibilityCheck[] = [
  { item: "anmeldung / ummeldung / abmeldung", supported: true, justification: "3 independent knowledge_processes rows, each with its own publication_states row (entity_type='process')." },
  { item: "federal baseline", supported: true, justification: "Default jurisdiction_id at the federal knowledge_jurisdictions level; no overlay needed." },
  { item: "Bundesland overlays", supported: true, justification: "knowledge_regional_overrides + inherited jurisdiction on the publication-state row." },
  { item: "municipality overlays", supported: true, justification: "Same mechanism, territorial_scope_id at municipality granularity." },
  { item: "authority overlays", supported: true, justification: "entity_type='authority_resolution_unit' publication subject + knowledge_regional_overrides." },
  { item: "effective dates", supported: true, justification: "effective_from/effective_until on the publication-state row, inherited from and cross-checked against the canonical row's own effective window." },
  { item: "conflicts", supported: true, justification: "knowledge_conflicts already blocks eligibility via the runtime AND-gate condition 7." },
  { item: "document rules", supported: true, justification: "entity_type='document_requirement' -> knowledge_evidence_requirements, fully mapped." },
  { item: "deadlines", supported: true, justification: "entity_type='deadline_rule' -> knowledge_deadline_rules, fully mapped; explanation text via the referencing process_step." },
  { item: "warnings", supported: true, justification: "Served by the existing knowledge_terminology/knowledge_localized_terminology mechanism; never suppressed by publication logic." },
  { item: "outcomes", supported: true, justification: "Same existing-terminology mechanism as warnings." },
  { item: "all six launch languages", supported: true, justification: "German natively on source tables + 5 non-German locales via knowledge_canonical_unit_translations = 6 total." },
  { item: "German fallback", supported: true, justification: "3-tier FALLBACK_TIERS design, tier 2." },
  { item: "complete pack publication", supported: true, justification: "entity_type='complete_process_pack_version' anchor-row design." },
  { item: "unit-level suspension", supported: true, justification: "Any of the 12 entity types can independently transition to suspended." },
  { item: "pack-level suspension", supported: true, justification: "The pack-anchor entity_type='complete_process_pack_version' can independently suspend; runtime AND-gate condition 10 makes this compositional with unit-level state." },
];

const FIRST_CONTACT_RESIDUAL_PRINCIPLE = {
  standaloneFirstContactModeIntroduced: false,
  onlyAdaptivePresentationInsideNormalSmartTalkRemainsValid: true,
} as const;

const DE_SK_BOUNDARY = {
  connectorRemainsInactive: true,
  firstPlannedPilot: FIRST_CROSS_BORDER_PILOT,
  crossBorderMappingInAnmeldungPack: false,
  crossBorderConnectorActivated: false,
} as const;

// ============================================================================
// PART I — FUTURE PHASE SEQUENCE
// ============================================================================

interface PhaseSequenceEntry {
  phaseId: string;
  label: string;
  objective: string;
  permitsSql: boolean;
  permitsDocker: boolean;
  permitsRealSourceRetrieval: boolean;
  permitsDatabaseWrite: boolean;
  permitsPublication: boolean;
}

const CANONICAL_PHASE_SEQUENCE: readonly PhaseSequenceEntry[] = [
  { phaseId: "9K", label: "Publication and Canonical Translation Schema Extension Design", objective: "This phase: design the additive schema extension.", permitsSql: false, permitsDocker: false, permitsRealSourceRetrieval: false, permitsDatabaseWrite: false, permitsPublication: false },
  { phaseId: "9L", label: "Publication and Canonical Translation Schema Extension Implementation Plan", objective: "Translate this design into a concrete migration implementation plan, still no SQL file.", permitsSql: false, permitsDocker: false, permitsRealSourceRetrieval: false, permitsDatabaseWrite: false, permitsPublication: false },
  { phaseId: "9M", label: "Additive SQL Migration Implementation", objective: "Author the actual additive SQL migration file implementing this design.", permitsSql: true, permitsDocker: false, permitsRealSourceRetrieval: false, permitsDatabaseWrite: false, permitsPublication: false },
  { phaseId: "9N", label: "Isolated PostgreSQL Validation", objective: "Validate the migration on a disposable, isolated PostgreSQL 17 container.", permitsSql: false, permitsDocker: true, permitsRealSourceRetrieval: false, permitsDatabaseWrite: true, permitsPublication: false },
  { phaseId: "9O", label: "Generated Database Type Decision/Closure", objective: "Decide and close out the TypeScript type-generation workflow for the new tables.", permitsSql: false, permitsDocker: false, permitsRealSourceRetrieval: false, permitsDatabaseWrite: false, permitsPublication: false },
  { phaseId: "9P", label: "Ingestion Contract Design or Implementation Boundary", objective: "Design or implement the ingestion contract now that the schema extension exists.", permitsSql: false, permitsDocker: false, permitsRealSourceRetrieval: false, permitsDatabaseWrite: false, permitsPublication: false },
];

const NEXT_RECOMMENDED_PHASE = `${CANONICAL_PHASE_SEQUENCE[1].phaseId} — ${CANONICAL_PHASE_SEQUENCE[1].label}`;

function phaseSequenceLabelsConsistent(seq: readonly PhaseSequenceEntry[]): boolean {
  const expectedIds = ["9K", "9L", "9M", "9N", "9O", "9P"];
  if (seq.length !== expectedIds.length) return false;
  return seq.every((e, i) => e.phaseId === expectedIds[i]);
}

// ============================================================================
// RESULT INTERFACE
// ============================================================================

interface Result {
  checkId: "9K";
  allPassed: boolean;
  designOnly: boolean;

  createdFileCount: number;
  modifiedExistingFileCount: number;
  existingFileModified: boolean;
  onlyExpectedFilesChanged: boolean;
  newAuditFileCreated: boolean;

  expectedHead: string;
  actualHead: string;
  headMatchesExpected: boolean;

  targetMigrationInspected: boolean;
  phase9IInspected: boolean;
  phase9JInspected: boolean;
  migration032Modified: boolean;
  expectedKnowledgeTableCount: number;
  actualKnowledgeTableCountObservedFromMigration: number;
  rlsEnabledTableCountObservedFromMigration: number;
  existingKnowledgeTablesPreserved: boolean;

  blockingSchemaGapCountBeforeDesign: number;
  blockingSchemaGapCountResolvedByDesign: number;
  futureAdditiveMigrationRequired: boolean;
  destructiveSchemaChangeProposed: boolean;

  publicationCurrentStateTableCandidate: string;
  publicationTransitionHistoryTableCandidate: string;
  canonicalTranslationTableCandidate: string;
  canonicalUnitRegistryRequired: boolean;
  proposedNewTableCount: number;

  publicationStateCount: number;
  allowedTransitionCount: number;
  terminalPublicationStateCount: number;
  reversiblePublicationStateCount: number;
  publicationHistoryAppendOnly: boolean;
  directCurrentStateMutationAllowed: boolean;
  withdrawalReversible: boolean;
  suspensionReversible: boolean;
  supersessionDeletesOldUnit: boolean;
  publicationStateAloneEnablesRuntime: boolean;

  translationStatusCount: number;
  genericTranslationTableSelected: boolean;
  translationBindsExactCanonicalVersion: boolean;
  machineTranslationAutoApprovalAllowed: boolean;
  machineTranslationAutoPublicationAllowed: boolean;
  canonicalChangeInvalidatesTranslations: boolean;
  historicalTranslationsRetained: boolean;
  unapprovedTranslationFallbackAllowed: boolean;

  supportedLaunchLanguageCount: number;
  futureInactiveLanguageCount: number;
  canonicalSourceLanguage: string;
  localeUsedForJurisdiction: boolean;

  allProposedTablesHaveRls: boolean;
  anonDirectWritesAllowed: boolean;
  authenticatedDirectWritesAllowed: boolean;
  publicDirectReadsAllowed: boolean;
  appendOnlyProtectionDesigned: boolean;
  transitionValidationDesigned: boolean;
  publicationAuthorizationRpcDesigned: boolean;
  translationAuthorizationBoundaryDesigned: boolean;

  migrationTimeBackfillRequired: boolean;

  realSourceFetched: boolean;
  databaseWritePerformed: boolean;
  remoteDatabaseUsed: boolean;
  dockerStarted: boolean;
  supabaseStarted: boolean;
  sqlMigrationCreated: boolean;
  runtimeRetrievalEnabled: boolean;
  germanKnowledgePackPublished: boolean;
  standaloneFirstContactModeIntroduced: boolean;
  crossBorderConnectorActivated: boolean;
  firstProcessPackId: string;
  firstPlannedCrossBorderPilot: string;

  // Extended tamper-checkable invariants beyond the REQUIRED REPORT FIELDS list
  booleanOnlyPublicationFlagUsed: boolean;
  mutableTransitionHistory: boolean;
  transitionRowDeletionAllowed: boolean;
  directCurrentStateMutationWithoutTransitionAllowed: boolean;
  arbitraryStateTransitionsAllowed: boolean;
  withdrawnToPublishedAllowed: boolean;
  supersededToPublishedAllowed: boolean;
  publishedRowPhysicallyDeleted: boolean;
  suspensionTreatedAsWithdrawal: boolean;
  withdrawalTreatedAsReversible: boolean;
  supersessionOverwritesOldRecord: boolean;
  publicationWithoutEvidenceAllowed: boolean;
  publicationWithoutCitationAllowed: boolean;
  publicationWithoutReviewAllowed: boolean;
  publicationWithUnresolvedConflictAllowed: boolean;
  runtimeRetrievalFromSuspendedUnitAllowed: boolean;
  runtimeRetrievalFromWithdrawnUnitAllowed: boolean;
  runtimeRetrievalFromSupersededCurrentUnitAllowed: boolean;
  emergencyDisableWithoutAuditTransitionAllowed: boolean;
  translationWithoutExactCanonicalVersionAllowed: boolean;
  translationWithoutFieldKeyAllowed: boolean;
  translationWithoutLocaleAllowed: boolean;
  translationTreatedAsCanonicalTruth: boolean;
  machineTranslationAutoPublished: boolean;
  oldTranslationSilentlyReusedAfterChange: boolean;
  translationHistoryOverwritten: boolean;
  twoActiveApprovedTranslationsForSameKeyAllowed: boolean;
  warningPreservationChecked: boolean;
  uncertaintyPreservationChecked: boolean;
  futureLocaleActivatedAutomatically: boolean;
  directAuthenticatedPublicationWriteAllowed: boolean;
  directAnonTranslationReadAllowed: boolean;
  publicGrantsAdded: boolean;
  destructiveModificationOfMigration032Tables: boolean;
  phaseSequenceLabelsConsistent: boolean;

  tamperCaseCount: number;
  tamperCasesRejectedCount: number;
  tamperCasesRejected: number;

  readyForPublicationAndCanonicalTranslationSchemaExtensionImplementationPlan: boolean;
  readyForRealGermanSourceIngestion: boolean;
  readyForControlledDatabaseWrite: boolean;
  readyForRuntimeRetrieval: boolean;
  productionAuthorizedNow: boolean;
  publicRuntimeAuthorizedNow: boolean;
  nextRecommendedPhase: string;

  designDetail: {
    stateRepresentationComparison: readonly StateRepresentationOption[];
    selectedStateRepresentation: string;
    allowedTransitions: readonly StateTransitionSpec[];
    terminalStates: readonly PublicationState[];
    reversibleStates: readonly PublicationState[];
    publicationSubjectTypes: readonly PublicationSubjectSpec[];
    currentStateTableDesign: typeof CURRENT_STATE_TABLE_DESIGN;
    transitionHistoryTableDesign: typeof TRANSITION_HISTORY_TABLE_DESIGN;
    suspensionDesign: typeof SUSPENSION_DESIGN;
    withdrawalDesign: typeof WITHDRAWAL_DESIGN;
    supersessionDesign: typeof SUPERSESSION_DESIGN;
    emergencyDisableDesign: typeof EMERGENCY_DISABLE_DESIGN;
    publicationEligibilityGate: readonly EligibilityCondition[];
    runtimeRetrievalAndGate: readonly string[];
    translationTableComparison: readonly TranslationTableComparisonCriterion[];
    translatableUnitMappings: readonly TranslatableUnitMapping[];
    translationTableDesign: typeof TRANSLATION_TABLE_DESIGN;
    languageRepresentationDecision: typeof LANGUAGE_REPRESENTATION_DECISION;
    canonicalVersionBinding: typeof CANONICAL_VERSION_BINDING;
    canonicalChangeInvalidationApproach: string;
    canonicalChangeInvalidationJustification: string;
    fallbackTiers: typeof FALLBACK_TIERS;
    warningAndUncertaintyParityPreservedAcrossFallback: boolean;
    translationUniquenessDesign: typeof TRANSLATION_UNIQUENESS_DESIGN;
    referenceOptions: readonly ReferenceOption[];
    polymorphicValidationBoundary: typeof POLYMORPHIC_VALIDATION_BOUNDARY;
    canonicalUnitRegistryAssessment: typeof CANONICAL_UNIT_REGISTRY_ASSESSMENT;
    processPackVersionIdentity: typeof PROCESS_PACK_VERSION_IDENTITY;
    rlsAndGrantsDesign: typeof RLS_AND_GRANTS_DESIGN;
    publicationTransitionRpc: RpcContractSpec;
    translationAuthorizationRpcs: readonly RpcContractSpec[];
    translationPermissionSeparation: typeof TRANSLATION_PERMISSION_SEPARATION;
    directTableWritesDecision: typeof DIRECT_TABLE_WRITES_DECISION;
    appendOnlyDesign: typeof APPEND_ONLY_DESIGN;
    proposedIndexes: readonly IndexSpec[];
    migrationBoundary: typeof MIGRATION_BOUNDARY_9K;
    migrationTimeBackfillJustification: string;
    rollbackBoundary: typeof ROLLBACK_BOUNDARY;
    firstPackCompatibility: readonly CompatibilityCheck[];
    canonicalPhaseSequence: readonly PhaseSequenceEntry[];
    newTableTranslatableEntityTypes: readonly string[];
    smartTalkRemainsReadOnly: boolean;
  };

  notes: string[];
}

// ============================================================================
// TAMPER HARNESS
// ============================================================================

type TamperCase = { id: number; description: string; mutate: (r: Result) => void };

const TAMPER_CASES: readonly TamperCase[] = [
  { id: 1, description: "boolean-only publication flag", mutate: (r) => { r.booleanOnlyPublicationFlagUsed = true; } },
  { id: 2, description: "no publication history", mutate: (r) => { r.publicationHistoryAppendOnly = false; } },
  { id: 3, description: "mutable transition history", mutate: (r) => { r.mutableTransitionHistory = true; } },
  { id: 4, description: "transition row deletion", mutate: (r) => { r.transitionRowDeletionAllowed = true; } },
  { id: 5, description: "direct current-state mutation without transition", mutate: (r) => { r.directCurrentStateMutationAllowed = true; r.directCurrentStateMutationWithoutTransitionAllowed = true; } },
  { id: 6, description: "arbitrary state transitions", mutate: (r) => { r.arbitraryStateTransitionsAllowed = true; } },
  { id: 7, description: "withdrawn -> published transition", mutate: (r) => { r.withdrawnToPublishedAllowed = true; } },
  { id: 8, description: "superseded -> published transition", mutate: (r) => { r.supersededToPublishedAllowed = true; } },
  { id: 9, description: "published row physically deleted", mutate: (r) => { r.publishedRowPhysicallyDeleted = true; } },
  { id: 10, description: "suspension treated as withdrawal", mutate: (r) => { r.suspensionTreatedAsWithdrawal = true; } },
  { id: 11, description: "withdrawal treated as reversible", mutate: (r) => { r.withdrawalTreatedAsReversible = true; r.withdrawalReversible = true; } },
  { id: 12, description: "supersession overwriting old record", mutate: (r) => { r.supersessionOverwritesOldRecord = true; r.supersessionDeletesOldUnit = true; } },
  { id: 13, description: "publication without evidence", mutate: (r) => { r.publicationWithoutEvidenceAllowed = true; } },
  { id: 14, description: "publication without citation", mutate: (r) => { r.publicationWithoutCitationAllowed = true; } },
  { id: 15, description: "publication without review", mutate: (r) => { r.publicationWithoutReviewAllowed = true; } },
  { id: 16, description: "publication with unresolved conflict", mutate: (r) => { r.publicationWithUnresolvedConflictAllowed = true; } },
  { id: 17, description: "runtime retrieval from suspended unit", mutate: (r) => { r.runtimeRetrievalFromSuspendedUnitAllowed = true; } },
  { id: 18, description: "runtime retrieval from withdrawn unit", mutate: (r) => { r.runtimeRetrievalFromWithdrawnUnitAllowed = true; } },
  { id: 19, description: "runtime retrieval from superseded current unit", mutate: (r) => { r.runtimeRetrievalFromSupersededCurrentUnitAllowed = true; } },
  { id: 20, description: "emergency disable without audit transition", mutate: (r) => { r.emergencyDisableWithoutAuditTransitionAllowed = true; } },
  { id: 21, description: "publication state alone enabling runtime retrieval", mutate: (r) => { r.publicationStateAloneEnablesRuntime = true; } },
  { id: 22, description: "translation without exact German canonical version", mutate: (r) => { r.translationWithoutExactCanonicalVersionAllowed = true; r.translationBindsExactCanonicalVersion = false; } },
  { id: 23, description: "translation without field key", mutate: (r) => { r.translationWithoutFieldKeyAllowed = true; } },
  { id: 24, description: "translation without locale", mutate: (r) => { r.translationWithoutLocaleAllowed = true; } },
  { id: 25, description: "translation treated as canonical truth", mutate: (r) => { r.translationTreatedAsCanonicalTruth = true; } },
  { id: 26, description: "machine translation auto-approved", mutate: (r) => { r.machineTranslationAutoApprovalAllowed = true; } },
  { id: 27, description: "machine translation auto-published", mutate: (r) => { r.machineTranslationAutoPublished = true; r.machineTranslationAutoPublicationAllowed = true; } },
  { id: 28, description: "old translation silently reused after German canonical change", mutate: (r) => { r.oldTranslationSilentlyReusedAfterChange = true; r.canonicalChangeInvalidatesTranslations = false; } },
  { id: 29, description: "translation history overwritten", mutate: (r) => { r.translationHistoryOverwritten = true; r.historicalTranslationsRetained = false; } },
  { id: 30, description: "two active approved translations for same canonical version/field/locale", mutate: (r) => { r.twoActiveApprovedTranslationsForSameKeyAllowed = true; } },
  { id: 31, description: "warning preservation not checked", mutate: (r) => { r.warningPreservationChecked = false; } },
  { id: 32, description: "uncertainty preservation not checked", mutate: (r) => { r.uncertaintyPreservationChecked = false; } },
  { id: 33, description: "future locale activated automatically", mutate: (r) => { r.futureLocaleActivatedAutomatically = true; } },
  { id: 34, description: "locale used as jurisdiction", mutate: (r) => { r.localeUsedForJurisdiction = true; } },
  { id: 35, description: "unapproved translation used as fallback", mutate: (r) => { r.unapprovedTranslationFallbackAllowed = true; } },
  { id: 36, description: "direct authenticated publication write", mutate: (r) => { r.directAuthenticatedPublicationWriteAllowed = true; r.authenticatedDirectWritesAllowed = true; } },
  { id: 37, description: "direct anon translation read", mutate: (r) => { r.directAnonTranslationReadAllowed = true; } },
  { id: 38, description: "missing RLS", mutate: (r) => { r.allProposedTablesHaveRls = false; } },
  { id: 39, description: "public grants added", mutate: (r) => { r.publicGrantsAdded = true; r.publicDirectReadsAllowed = true; } },
  { id: 40, description: "destructive modification of migration-032 tables", mutate: (r) => { r.destructiveModificationOfMigration032Tables = true; r.destructiveSchemaChangeProposed = true; } },
  { id: 41, description: "migration 032 modified", mutate: (r) => { r.migration032Modified = true; } },
  { id: 42, description: "SQL migration created in 9K", mutate: (r) => { r.sqlMigrationCreated = true; } },
  { id: 43, description: "more than one file created", mutate: (r) => { r.createdFileCount = 2; } },
  { id: 44, description: "existing file modified", mutate: (r) => { r.existingFileModified = true; r.modifiedExistingFileCount = 1; } },
  { id: 45, description: "Docker started", mutate: (r) => { r.dockerStarted = true; } },
  { id: 46, description: "Supabase started", mutate: (r) => { r.supabaseStarted = true; } },
  { id: 47, description: "database written", mutate: (r) => { r.databaseWritePerformed = true; } },
  { id: 48, description: "remote database used", mutate: (r) => { r.remoteDatabaseUsed = true; } },
  { id: 49, description: "real source fetched", mutate: (r) => { r.realSourceFetched = true; } },
  { id: 50, description: "real knowledge inserted", mutate: (r) => { r.databaseWritePerformed = true; } },
  { id: 51, description: "standalone First Contact mode introduced", mutate: (r) => { r.standaloneFirstContactModeIntroduced = true; } },
  { id: 52, description: "DE<->SK connector activated", mutate: (r) => { r.crossBorderConnectorActivated = true; } },
  { id: 53, description: "first process-pack ID changed", mutate: (r) => { r.firstProcessPackId = "anmeldung_only"; } },
  { id: 54, description: "canonical language changed from de", mutate: (r) => { r.canonicalSourceLanguage = "en"; } },
  { id: 55, description: "launch language count changed from 6", mutate: (r) => { r.supportedLaunchLanguageCount = 5; } },
  { id: 56, description: "production authorized", mutate: (r) => { r.productionAuthorizedNow = true; } },
  { id: 57, description: "public runtime authorized", mutate: (r) => { r.publicRuntimeAuthorizedNow = true; } },
  { id: 58, description: "phase sequence labels inconsistent", mutate: (r) => { r.phaseSequenceLabelsConsistent = false; } },
  { id: 59, description: "next phase changed from 9L implementation plan", mutate: (r) => { r.nextRecommendedPhase = "9M — Additive SQL Migration Implementation"; } },
  { id: 60, description: "blockingSchemaGapCountResolvedByDesign tampered below 2", mutate: (r) => { r.blockingSchemaGapCountResolvedByDesign = 1; } },
  { id: 61, description: "existingKnowledgeTablesPreserved false but allPassed true", mutate: (r) => { r.existingKnowledgeTablesPreserved = false; r.allPassed = true; } },
  { id: 62, description: "readyForRealGermanSourceIngestion true in this phase", mutate: (r) => { r.readyForRealGermanSourceIngestion = true; } },
  { id: 63, description: "readyForControlledDatabaseWrite true in this phase", mutate: (r) => { r.readyForControlledDatabaseWrite = true; } },
  { id: 64, description: "readyForRuntimeRetrieval true in this phase", mutate: (r) => { r.readyForRuntimeRetrieval = true; } },
  { id: 65, description: "readyForPublicationAndCanonicalTranslationSchemaExtensionImplementationPlan true while allPassed false", mutate: (r) => { r.readyForPublicationAndCanonicalTranslationSchemaExtensionImplementationPlan = true; r.allPassed = false; } },
  { id: 66, description: "actualKnowledgeTableCountObservedFromMigration tampered", mutate: (r) => { r.actualKnowledgeTableCountObservedFromMigration = 30; } },
  { id: 67, description: "publicationStateCount tampered", mutate: (r) => { r.publicationStateCount = 8; } },
  { id: 68, description: "allowedTransitionCount tampered", mutate: (r) => { r.allowedTransitionCount = 5; } },
  { id: 69, description: "headMatchesExpected false but allPassed true", mutate: (r) => { r.headMatchesExpected = false; r.allPassed = true; } },
  { id: 70, description: "appendOnlyProtectionDesigned false", mutate: (r) => { r.appendOnlyProtectionDesigned = false; } },
  { id: 71, description: "transitionValidationDesigned false", mutate: (r) => { r.transitionValidationDesigned = false; } },
  { id: 72, description: "publicationAuthorizationRpcDesigned false", mutate: (r) => { r.publicationAuthorizationRpcDesigned = false; } },
  { id: 73, description: "translationAuthorizationBoundaryDesigned false", mutate: (r) => { r.translationAuthorizationBoundaryDesigned = false; } },
];

function runTamperCases(good: Result): { rejected: number; total: number; failures: string[] } {
  let rejected = 0;
  const failures: string[] = [];
  for (const tc of TAMPER_CASES) {
    const mutated = clone(good);
    tc.mutate(mutated);
    const stillPasses = computeExpectedAllPassed(mutated);
    if (!stillPasses) {
      rejected += 1;
    } else {
      failures.push(`#${tc.id} ${tc.description}`);
    }
  }
  return { rejected, total: TAMPER_CASES.length, failures };
}

// ============================================================================
// VALIDATOR
// ============================================================================

function computeExpectedAllPassed(r: Result): boolean {
  const checks: boolean[] = [
    r.checkId === "9K",
    r.designOnly === true,

    r.createdFileCount === 1,
    r.modifiedExistingFileCount === 0,
    r.existingFileModified === false,
    r.onlyExpectedFilesChanged === true,
    r.newAuditFileCreated === true,

    r.headMatchesExpected === true,
    r.expectedHead === SOURCE_CLOSURE_COMMIT,

    r.targetMigrationInspected === true,
    r.phase9IInspected === true,
    r.phase9JInspected === true,
    r.migration032Modified === false,
    r.expectedKnowledgeTableCount === EXPECTED_KNOWLEDGE_TABLE_COUNT,
    r.actualKnowledgeTableCountObservedFromMigration === EXPECTED_KNOWLEDGE_TABLE_COUNT,
    r.rlsEnabledTableCountObservedFromMigration === EXPECTED_KNOWLEDGE_TABLE_COUNT,
    r.existingKnowledgeTablesPreserved === true,

    r.blockingSchemaGapCountBeforeDesign === 2,
    r.blockingSchemaGapCountResolvedByDesign === 2,
    r.futureAdditiveMigrationRequired === true,
    r.destructiveSchemaChangeProposed === false,

    r.publicationCurrentStateTableCandidate === CURRENT_STATE_TABLE_NAME_CANDIDATE,
    r.publicationTransitionHistoryTableCandidate === TRANSITION_HISTORY_TABLE_NAME_CANDIDATE,
    r.canonicalTranslationTableCandidate === TRANSLATION_TABLE_NAME_CANDIDATE,
    r.canonicalUnitRegistryRequired === false,
    r.proposedNewTableCount === NEW_TABLE_CANDIDATES.length,
    r.proposedNewTableCount === 3,

    r.publicationStateCount === PUBLICATION_STATES.length,
    r.publicationStateCount === 9,
    r.allowedTransitionCount === ALLOWED_TRANSITIONS.length,
    r.terminalPublicationStateCount === TERMINAL_STATES.length,
    r.reversiblePublicationStateCount === REVERSIBLE_STATES.length,
    r.publicationHistoryAppendOnly === true,
    r.directCurrentStateMutationAllowed === false,
    r.withdrawalReversible === false,
    r.suspensionReversible === true,
    r.supersessionDeletesOldUnit === false,
    r.publicationStateAloneEnablesRuntime === false,

    r.translationStatusCount === TRANSLATION_STATUSES.length,
    r.translationStatusCount === 8,
    r.genericTranslationTableSelected === true,
    r.genericTranslationTableSelected === GENERIC_TRANSLATION_TABLE_SELECTED,
    r.translationBindsExactCanonicalVersion === true,
    r.machineTranslationAutoApprovalAllowed === false,
    r.machineTranslationAutoPublicationAllowed === false,
    r.canonicalChangeInvalidatesTranslations === true,
    r.historicalTranslationsRetained === true,
    r.unapprovedTranslationFallbackAllowed === false,

    r.supportedLaunchLanguageCount === 6,
    r.futureInactiveLanguageCount === 5,
    r.canonicalSourceLanguage === "de",
    r.localeUsedForJurisdiction === false,

    r.allProposedTablesHaveRls === true,
    r.anonDirectWritesAllowed === false,
    r.authenticatedDirectWritesAllowed === false,
    r.publicDirectReadsAllowed === false,
    r.appendOnlyProtectionDesigned === true,
    r.transitionValidationDesigned === true,
    r.publicationAuthorizationRpcDesigned === true,
    r.translationAuthorizationBoundaryDesigned === true,

    r.migrationTimeBackfillRequired === false,

    r.realSourceFetched === false,
    r.databaseWritePerformed === false,
    r.remoteDatabaseUsed === false,
    r.dockerStarted === false,
    r.supabaseStarted === false,
    r.sqlMigrationCreated === false,
    r.runtimeRetrievalEnabled === false,
    r.germanKnowledgePackPublished === false,
    r.standaloneFirstContactModeIntroduced === false,
    r.crossBorderConnectorActivated === false,
    r.firstProcessPackId === FIRST_PROCESS_PACK_ID,
    r.firstPlannedCrossBorderPilot === FIRST_CROSS_BORDER_PILOT,

    r.booleanOnlyPublicationFlagUsed === false,
    r.mutableTransitionHistory === false,
    r.transitionRowDeletionAllowed === false,
    r.directCurrentStateMutationWithoutTransitionAllowed === false,
    r.arbitraryStateTransitionsAllowed === false,
    r.withdrawnToPublishedAllowed === false,
    r.supersededToPublishedAllowed === false,
    r.publishedRowPhysicallyDeleted === false,
    r.suspensionTreatedAsWithdrawal === false,
    r.withdrawalTreatedAsReversible === false,
    r.supersessionOverwritesOldRecord === false,
    r.publicationWithoutEvidenceAllowed === false,
    r.publicationWithoutCitationAllowed === false,
    r.publicationWithoutReviewAllowed === false,
    r.publicationWithUnresolvedConflictAllowed === false,
    r.runtimeRetrievalFromSuspendedUnitAllowed === false,
    r.runtimeRetrievalFromWithdrawnUnitAllowed === false,
    r.runtimeRetrievalFromSupersededCurrentUnitAllowed === false,
    r.emergencyDisableWithoutAuditTransitionAllowed === false,
    r.translationWithoutExactCanonicalVersionAllowed === false,
    r.translationWithoutFieldKeyAllowed === false,
    r.translationWithoutLocaleAllowed === false,
    r.translationTreatedAsCanonicalTruth === false,
    r.machineTranslationAutoPublished === false,
    r.oldTranslationSilentlyReusedAfterChange === false,
    r.translationHistoryOverwritten === false,
    r.twoActiveApprovedTranslationsForSameKeyAllowed === false,
    r.warningPreservationChecked === true,
    r.uncertaintyPreservationChecked === true,
    r.futureLocaleActivatedAutomatically === false,
    r.directAuthenticatedPublicationWriteAllowed === false,
    r.directAnonTranslationReadAllowed === false,
    r.publicGrantsAdded === false,
    r.destructiveModificationOfMigration032Tables === false,
    r.phaseSequenceLabelsConsistent === true,

    r.tamperCaseCount === TAMPER_CASES.length,
    r.tamperCasesRejectedCount <= r.tamperCaseCount,
    r.tamperCasesRejected <= r.tamperCaseCount,

    r.readyForRealGermanSourceIngestion === false,
    r.readyForControlledDatabaseWrite === false,
    r.readyForRuntimeRetrieval === false,
    r.productionAuthorizedNow === false,
    r.publicRuntimeAuthorizedNow === false,
    r.nextRecommendedPhase === NEXT_RECOMMENDED_PHASE,

    !(r.readyForPublicationAndCanonicalTranslationSchemaExtensionImplementationPlan === true && r.allPassed === false),
    !(r.readyForPublicationAndCanonicalTranslationSchemaExtensionImplementationPlan === true && r.headMatchesExpected === false),
    !(r.readyForPublicationAndCanonicalTranslationSchemaExtensionImplementationPlan === true && r.existingKnowledgeTablesPreserved === false),
  ];
  return checks.every(Boolean);
}

// ============================================================================
// EVIDENCE COLLECTION (static source inspection + read-only git)
// ============================================================================

interface Evidence {
  onlyExpectedFilesChanged: boolean;
  existingFileModified: boolean;
  newAuditFileCreated: boolean;
  createdFileCount: number;
  modifiedExistingFileCount: number;
  actualHead: string;
  headMatchesExpected: boolean;
  actualKnowledgeTableCountObservedFromMigration: number;
  rlsEnabledTableCountObservedFromMigration: number;
  migrationHasInsertStatements: boolean;
  migrationHasAnonOrAuthenticatedPolicy: boolean;
  migrationHasDropOrRename: boolean;
  migrationUsesJsonb: boolean;
  targetMigrationInspected: boolean;
  migration032Modified: boolean;
  existingKnowledgeTablesPreserved: boolean;
  phase9IInspected: boolean;
  phase9IReportsCheckId9I: boolean;
  phase9JInspected: boolean;
  phase9JReportsCheckId9J: boolean;
  phase9JReportsBlockingGapCount2: boolean;
  notes: string[];
}

function collectEvidence(): Evidence {
  const notes: string[] = [];

  const statusPorcelain = runGitReadOnly("git status --porcelain");
  const trackedLines = statusPorcelain
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const relevantLines = trackedLines.filter((l) => !l.includes(".next/") && !l.includes(".next\\"));

  const untracked = relevantLines.filter((l) => l.startsWith("??")).map((l) => l.replace(/^\?\?\s*/, ""));
  const modifiedOrStaged = relevantLines.filter((l) => !l.startsWith("??"));

  const expectedNewFile = AUDIT_SELF_REL_PATH;
  const unexpectedUntracked = untracked.filter((f) => f.replace(/\\/g, "/") !== expectedNewFile);
  const newAuditFileCreated = untracked.some((f) => f.replace(/\\/g, "/") === expectedNewFile);

  const existingFileModified = modifiedOrStaged.length > 0;
  const onlyExpectedFilesChanged = unexpectedUntracked.length === 0 && !existingFileModified;
  const createdFileCount = untracked.filter((f) => f.replace(/\\/g, "/") === expectedNewFile).length;
  const modifiedExistingFileCount = modifiedOrStaged.length;

  if (unexpectedUntracked.length > 0) notes.push(`Unexpected untracked files: ${unexpectedUntracked.join(", ")}`);
  if (existingFileModified) notes.push(`Unexpected modified/staged files: ${modifiedOrStaged.join(", ")}`);

  const actualHead = runGitReadOnly("git rev-parse --short HEAD");
  const headMatchesExpected = actualHead === SOURCE_CLOSURE_COMMIT;

  const migrationSql = readFileText(MIGRATION_REL_PATH);
  const targetMigrationInspected = migrationSql.length > 0;
  const tableNames = extractKnowledgeTableNames(migrationSql);
  const rlsTables = extractRlsEnabledTables(migrationSql);
  const migrationDiff = runGitReadOnly(`git diff -- ${MIGRATION_REL_PATH}`);
  const migration032Modified = migrationDiff.trim().length > 0;
  const migrationDropOrRenameDetected = migrationHasDropOrRename(migrationSql);

  const NEW_TABLE_NAME_LIST = [CURRENT_STATE_TABLE_NAME_CANDIDATE, TRANSITION_HISTORY_TABLE_NAME_CANDIDATE, TRANSLATION_TABLE_NAME_CANDIDATE];
  const existingKnowledgeTablesPreserved =
    tableNames.length === EXPECTED_KNOWLEDGE_TABLE_COUNT &&
    !migrationDropOrRenameDetected &&
    NEW_TABLE_NAME_LIST.every((n) => !tableNames.includes(n));

  const phase9ISrc = readFileText(PHASE_9I_REL_PATH);
  const phase9IInspected = phase9ISrc.length > 0;
  const phase9IReportsCheckId9I = /checkId:\s*"9I"/.test(phase9ISrc);

  const phase9JSrc = readFileText(PHASE_9J_REL_PATH);
  const phase9JInspected = phase9JSrc.length > 0;
  const phase9JReportsCheckId9J = /checkId:\s*"9J"/.test(phase9JSrc);
  const phase9JReportsBlockingGapCount2 = /BLOCKING_GAP_RESOLUTIONS\.length\s*===\s*2/.test(phase9JSrc);

  if (!phase9IInspected) notes.push(`Could not read ${PHASE_9I_REL_PATH}`);
  if (!phase9JInspected) notes.push(`Could not read ${PHASE_9J_REL_PATH}`);
  if (!targetMigrationInspected) notes.push(`Could not read ${MIGRATION_REL_PATH}`);

  return {
    onlyExpectedFilesChanged,
    existingFileModified,
    newAuditFileCreated,
    createdFileCount,
    modifiedExistingFileCount,
    actualHead,
    headMatchesExpected,
    actualKnowledgeTableCountObservedFromMigration: tableNames.length,
    rlsEnabledTableCountObservedFromMigration: rlsTables.length,
    migrationHasInsertStatements: migrationHasInsertStatements(migrationSql),
    migrationHasAnonOrAuthenticatedPolicy: migrationHasAnonOrAuthenticatedPolicy(migrationSql),
    migrationHasDropOrRename: migrationDropOrRenameDetected,
    migrationUsesJsonb: migrationUsesJsonb(migrationSql),
    targetMigrationInspected,
    migration032Modified,
    existingKnowledgeTablesPreserved,
    phase9IInspected,
    phase9IReportsCheckId9I,
    phase9JInspected,
    phase9JReportsCheckId9J,
    phase9JReportsBlockingGapCount2,
    notes,
  };
}

// ============================================================================
// GOOD-RESULT CONSTRUCTION
// ============================================================================

function buildGoodResult(evidence: Evidence): Result {
  const designComplete =
    PUBLICATION_STATES.length === 9 &&
    ALLOWED_TRANSITIONS.length === 20 &&
    TERMINAL_STATES.length === 2 &&
    REVERSIBLE_STATES.length === 5 &&
    PUBLICATION_SUBJECT_TYPES.length === 12 &&
    TRANSLATION_STATUSES.length === 8 &&
    TRANSLATABLE_UNIT_MAPPINGS.length === 10 &&
    TRANSLATABLE_UNIT_MAPPINGS.filter((m) => m.mechanism === "new_generic_table").length === 8 &&
    TRANSLATABLE_UNIT_MAPPINGS.filter((m) => m.mechanism === "existing_terminology_table").length === 2 &&
    NEW_TABLE_CANDIDATES.length === 3 &&
    PROPOSED_INDEXES.length === MIGRATION_BOUNDARY_9K.proposedIndexes &&
    FIRST_PACK_COMPATIBILITY.length === 16 &&
    FIRST_PACK_COMPATIBILITY.every((c) => c.supported) &&
    LAUNCH_LOCALES.length === 6 &&
    FUTURE_LOCALES.length === 5 &&
    NON_GERMAN_LAUNCH_LOCALES.length === 5 &&
    TRANSITION_REASON_CODES.length === 16 &&
    SUSPENSION_OR_WITHDRAWAL_REQUIRED_REASON_CODES.length === 6 &&
    TRANSLATION_TERMINAL_STATUSES.length === 3 &&
    RUNTIME_RETRIEVAL_AND_GATE.length === 10 &&
    PUBLICATION_ELIGIBILITY_GATE.length === 13 &&
    STATE_REPRESENTATION_COMPARISON.filter((o) => o.selected).length === 1 &&
    SELECTED_STATE_REPRESENTATION.option === "checked_text_domain" &&
    TRANSLATION_TABLE_COMPARISON_SCORE.genericWinCount >= TRANSLATION_TABLE_COMPARISON_SCORE.entitySpecificWinCount &&
    REFERENCE_OPTIONS.filter((o) => o.selected).length === 1 &&
    REFERENCE_OPTIONS.find((o) => o.selected)!.option === "polymorphic_entity_type_entity_id" &&
    CANONICAL_UNIT_REGISTRY_ASSESSMENT.decision === "optional_later" &&
    !CANONICAL_UNIT_REGISTRY_ASSESSMENT.requiredBeforeFirstIngestion &&
    phaseSequenceLabelsConsistent(CANONICAL_PHASE_SEQUENCE) &&
    NEXT_RECOMMENDED_PHASE === "9L — Publication and Canonical Translation Schema Extension Implementation Plan" &&
    ROLLBACK_BOUNDARY.destructiveDropAcceptableAfterPublication === false &&
    APPEND_ONLY_DESIGN.realProductionHistoryNeverDeletedAsRoutineRollback === true &&
    MIGRATION_BOUNDARY_9K.noDestructiveChangeToExisting33Tables === true &&
    MIGRATION_BOUNDARY_9K.noRealRowsInsertedInSamePhase === true &&
    MIGRATION_BOUNDARY_9K.noProductionApplicationInSamePhase === true &&
    LANGUAGE_REPRESENTATION_DECISION.germanStoredAsIndependentTranslationOfItself === false &&
    LANGUAGE_REPRESENTATION_DECISION.englishOrSlovakTreatedAsCanonicalTruth === false &&
    FIRST_CONTACT_RESIDUAL_PRINCIPLE.standaloneFirstContactModeIntroduced === false &&
    DE_SK_BOUNDARY.connectorRemainsInactive === true &&
    DE_SK_BOUNDARY.crossBorderMappingInAnmeldungPack === false &&
    DE_SK_BOUNDARY.firstPlannedPilot === FIRST_CROSS_BORDER_PILOT &&
    transitionIsAllowed(null, "draft") === true &&
    transitionIsAllowed("withdrawn", "published") === false &&
    transitionIsAllowed("superseded", "published") === false &&
    transitionIsAllowed("draft", "published") === false &&
    NEW_TABLE_TRANSLATABLE_ENTITY_TYPES.length === 5 &&
    TRANSLATION_PERMISSION_SEPARATION.distinctPermissions.length === 6 &&
    !TRANSLATION_PERMISSION_SEPARATION.oneActorAutomaticallyGainsEveryPermission &&
    SMART_TALK_REMAINS_READ_ONLY === true;

  const allPassed =
    designComplete &&
    evidence.onlyExpectedFilesChanged &&
    !evidence.existingFileModified &&
    evidence.newAuditFileCreated &&
    evidence.createdFileCount === 1 &&
    evidence.modifiedExistingFileCount === 0 &&
    evidence.headMatchesExpected &&
    evidence.targetMigrationInspected &&
    !evidence.migration032Modified &&
    !evidence.migrationHasDropOrRename &&
    evidence.actualKnowledgeTableCountObservedFromMigration === EXPECTED_KNOWLEDGE_TABLE_COUNT &&
    evidence.rlsEnabledTableCountObservedFromMigration === EXPECTED_KNOWLEDGE_TABLE_COUNT &&
    !evidence.migrationHasInsertStatements &&
    !evidence.migrationHasAnonOrAuthenticatedPolicy &&
    evidence.existingKnowledgeTablesPreserved &&
    evidence.phase9IInspected &&
    evidence.phase9IReportsCheckId9I &&
    evidence.phase9JInspected &&
    evidence.phase9JReportsCheckId9J &&
    evidence.phase9JReportsBlockingGapCount2;

  const readyForPublicationAndCanonicalTranslationSchemaExtensionImplementationPlan = allPassed;
  const readyForRealGermanSourceIngestion = false;
  const readyForControlledDatabaseWrite = false;
  const readyForRuntimeRetrieval = false;

  return {
    checkId: "9K",
    allPassed,
    designOnly: true,

    createdFileCount: evidence.createdFileCount,
    modifiedExistingFileCount: evidence.modifiedExistingFileCount,
    existingFileModified: evidence.existingFileModified,
    onlyExpectedFilesChanged: evidence.onlyExpectedFilesChanged,
    newAuditFileCreated: evidence.newAuditFileCreated,

    expectedHead: SOURCE_CLOSURE_COMMIT,
    actualHead: evidence.actualHead,
    headMatchesExpected: evidence.headMatchesExpected,

    targetMigrationInspected: evidence.targetMigrationInspected,
    phase9IInspected: evidence.phase9IInspected,
    phase9JInspected: evidence.phase9JInspected,
    migration032Modified: evidence.migration032Modified,
    expectedKnowledgeTableCount: EXPECTED_KNOWLEDGE_TABLE_COUNT,
    actualKnowledgeTableCountObservedFromMigration: evidence.actualKnowledgeTableCountObservedFromMigration,
    rlsEnabledTableCountObservedFromMigration: evidence.rlsEnabledTableCountObservedFromMigration,
    existingKnowledgeTablesPreserved: evidence.existingKnowledgeTablesPreserved,

    blockingSchemaGapCountBeforeDesign: 2,
    blockingSchemaGapCountResolvedByDesign: 2,
    futureAdditiveMigrationRequired: true,
    destructiveSchemaChangeProposed: false,

    publicationCurrentStateTableCandidate: CURRENT_STATE_TABLE_NAME_CANDIDATE,
    publicationTransitionHistoryTableCandidate: TRANSITION_HISTORY_TABLE_NAME_CANDIDATE,
    canonicalTranslationTableCandidate: TRANSLATION_TABLE_NAME_CANDIDATE,
    canonicalUnitRegistryRequired: CANONICAL_UNIT_REGISTRY_REQUIRED,
    proposedNewTableCount: NEW_TABLE_CANDIDATES.length,

    publicationStateCount: PUBLICATION_STATES.length,
    allowedTransitionCount: ALLOWED_TRANSITIONS.length,
    terminalPublicationStateCount: TERMINAL_STATES.length,
    reversiblePublicationStateCount: REVERSIBLE_STATES.length,
    publicationHistoryAppendOnly: true,
    directCurrentStateMutationAllowed: false,
    withdrawalReversible: WITHDRAWAL_DESIGN.reversibleToPublished,
    suspensionReversible: SUSPENSION_DESIGN.reversible,
    supersessionDeletesOldUnit: !SUPERSESSION_DESIGN.preservesOldUnit,
    publicationStateAloneEnablesRuntime: PUBLICATION_STATE_ALONE_ENABLES_RUNTIME,

    translationStatusCount: TRANSLATION_STATUSES.length,
    genericTranslationTableSelected: GENERIC_TRANSLATION_TABLE_SELECTED,
    translationBindsExactCanonicalVersion: true,
    machineTranslationAutoApprovalAllowed: false,
    machineTranslationAutoPublicationAllowed: false,
    canonicalChangeInvalidatesTranslations: true,
    historicalTranslationsRetained: true,
    unapprovedTranslationFallbackAllowed: UNAPPROVED_TRANSLATION_FALLBACK_ALLOWED,

    supportedLaunchLanguageCount: LAUNCH_LOCALES.length,
    futureInactiveLanguageCount: FUTURE_LOCALES.length,
    canonicalSourceLanguage: "de",
    localeUsedForJurisdiction: LANGUAGE_REPRESENTATION_DECISION.localeUsedForJurisdiction,

    allProposedTablesHaveRls: RLS_AND_GRANTS_DESIGN.allProposedTablesHaveRls,
    anonDirectWritesAllowed: RLS_AND_GRANTS_DESIGN.anonDirectWritesAllowed,
    authenticatedDirectWritesAllowed: RLS_AND_GRANTS_DESIGN.authenticatedDirectWritesAllowed,
    publicDirectReadsAllowed: RLS_AND_GRANTS_DESIGN.publicDirectReadsAllowed,
    appendOnlyProtectionDesigned: true,
    transitionValidationDesigned: true,
    publicationAuthorizationRpcDesigned: true,
    translationAuthorizationBoundaryDesigned: true,

    migrationTimeBackfillRequired: MIGRATION_TIME_BACKFILL_REQUIRED,

    realSourceFetched: false,
    databaseWritePerformed: false,
    remoteDatabaseUsed: false,
    dockerStarted: false,
    supabaseStarted: false,
    sqlMigrationCreated: false,
    runtimeRetrievalEnabled: false,
    germanKnowledgePackPublished: false,
    standaloneFirstContactModeIntroduced: FIRST_CONTACT_RESIDUAL_PRINCIPLE.standaloneFirstContactModeIntroduced,
    crossBorderConnectorActivated: DE_SK_BOUNDARY.crossBorderConnectorActivated,
    firstProcessPackId: FIRST_PROCESS_PACK_ID,
    firstPlannedCrossBorderPilot: DE_SK_BOUNDARY.firstPlannedPilot,

    booleanOnlyPublicationFlagUsed: false,
    mutableTransitionHistory: false,
    transitionRowDeletionAllowed: false,
    directCurrentStateMutationWithoutTransitionAllowed: false,
    arbitraryStateTransitionsAllowed: false,
    withdrawnToPublishedAllowed: false,
    supersededToPublishedAllowed: false,
    publishedRowPhysicallyDeleted: false,
    suspensionTreatedAsWithdrawal: false,
    withdrawalTreatedAsReversible: false,
    supersessionOverwritesOldRecord: false,
    publicationWithoutEvidenceAllowed: false,
    publicationWithoutCitationAllowed: false,
    publicationWithoutReviewAllowed: false,
    publicationWithUnresolvedConflictAllowed: false,
    runtimeRetrievalFromSuspendedUnitAllowed: false,
    runtimeRetrievalFromWithdrawnUnitAllowed: false,
    runtimeRetrievalFromSupersededCurrentUnitAllowed: false,
    emergencyDisableWithoutAuditTransitionAllowed: false,
    translationWithoutExactCanonicalVersionAllowed: false,
    translationWithoutFieldKeyAllowed: false,
    translationWithoutLocaleAllowed: false,
    translationTreatedAsCanonicalTruth: false,
    machineTranslationAutoPublished: false,
    oldTranslationSilentlyReusedAfterChange: false,
    translationHistoryOverwritten: false,
    twoActiveApprovedTranslationsForSameKeyAllowed: false,
    warningPreservationChecked: true,
    uncertaintyPreservationChecked: true,
    futureLocaleActivatedAutomatically: false,
    directAuthenticatedPublicationWriteAllowed: false,
    directAnonTranslationReadAllowed: false,
    publicGrantsAdded: false,
    destructiveModificationOfMigration032Tables: false,
    phaseSequenceLabelsConsistent: phaseSequenceLabelsConsistent(CANONICAL_PHASE_SEQUENCE),

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejectedCount: 0,
    tamperCasesRejected: 0,

    readyForPublicationAndCanonicalTranslationSchemaExtensionImplementationPlan,
    readyForRealGermanSourceIngestion,
    readyForControlledDatabaseWrite,
    readyForRuntimeRetrieval,
    productionAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    nextRecommendedPhase: NEXT_RECOMMENDED_PHASE,

    designDetail: {
      stateRepresentationComparison: STATE_REPRESENTATION_COMPARISON,
      selectedStateRepresentation: SELECTED_STATE_REPRESENTATION.option,
      allowedTransitions: ALLOWED_TRANSITIONS,
      terminalStates: TERMINAL_STATES,
      reversibleStates: REVERSIBLE_STATES,
      publicationSubjectTypes: PUBLICATION_SUBJECT_TYPES,
      currentStateTableDesign: CURRENT_STATE_TABLE_DESIGN,
      transitionHistoryTableDesign: TRANSITION_HISTORY_TABLE_DESIGN,
      suspensionDesign: SUSPENSION_DESIGN,
      withdrawalDesign: WITHDRAWAL_DESIGN,
      supersessionDesign: SUPERSESSION_DESIGN,
      emergencyDisableDesign: EMERGENCY_DISABLE_DESIGN,
      publicationEligibilityGate: PUBLICATION_ELIGIBILITY_GATE,
      runtimeRetrievalAndGate: RUNTIME_RETRIEVAL_AND_GATE,
      translationTableComparison: TRANSLATION_TABLE_COMPARISON,
      translatableUnitMappings: TRANSLATABLE_UNIT_MAPPINGS,
      translationTableDesign: TRANSLATION_TABLE_DESIGN,
      languageRepresentationDecision: LANGUAGE_REPRESENTATION_DECISION,
      canonicalVersionBinding: CANONICAL_VERSION_BINDING,
      canonicalChangeInvalidationApproach: CANONICAL_CHANGE_INVALIDATION_APPROACH,
      canonicalChangeInvalidationJustification: CANONICAL_CHANGE_INVALIDATION_JUSTIFICATION,
      fallbackTiers: FALLBACK_TIERS,
      warningAndUncertaintyParityPreservedAcrossFallback: WARNING_AND_UNCERTAINTY_PARITY_PRESERVED_ACROSS_FALLBACK,
      translationUniquenessDesign: TRANSLATION_UNIQUENESS_DESIGN,
      referenceOptions: REFERENCE_OPTIONS,
      polymorphicValidationBoundary: POLYMORPHIC_VALIDATION_BOUNDARY,
      canonicalUnitRegistryAssessment: CANONICAL_UNIT_REGISTRY_ASSESSMENT,
      processPackVersionIdentity: PROCESS_PACK_VERSION_IDENTITY,
      rlsAndGrantsDesign: RLS_AND_GRANTS_DESIGN,
      publicationTransitionRpc: PUBLICATION_TRANSITION_RPC,
      translationAuthorizationRpcs: TRANSLATION_AUTHORIZATION_RPCS,
      translationPermissionSeparation: TRANSLATION_PERMISSION_SEPARATION,
      directTableWritesDecision: DIRECT_TABLE_WRITES_DECISION,
      appendOnlyDesign: APPEND_ONLY_DESIGN,
      proposedIndexes: PROPOSED_INDEXES,
      migrationBoundary: MIGRATION_BOUNDARY_9K,
      migrationTimeBackfillJustification: BACKFILL_JUSTIFICATION,
      rollbackBoundary: ROLLBACK_BOUNDARY,
      firstPackCompatibility: FIRST_PACK_COMPATIBILITY,
      canonicalPhaseSequence: CANONICAL_PHASE_SEQUENCE,
      newTableTranslatableEntityTypes: NEW_TABLE_TRANSLATABLE_ENTITY_TYPES,
      smartTalkRemainsReadOnly: SMART_TALK_REMAINS_READ_ONLY,
    },

    notes: [
      `onlyExpectedFilesChanged: ${evidence.onlyExpectedFilesChanged}`,
      `existingFileModified: ${evidence.existingFileModified}`,
      `newAuditFileCreated: ${evidence.newAuditFileCreated}`,
      `headMatchesExpected (${SOURCE_CLOSURE_COMMIT}): ${evidence.headMatchesExpected}`,
      `migration032Modified (git diff): ${evidence.migration032Modified}`,
      `migrationHasDropOrRename: ${evidence.migrationHasDropOrRename}`,
      `migrationUsesJsonb: ${evidence.migrationUsesJsonb} (informs the decision to avoid jsonb in the new tables)`,
      `actualKnowledgeTableCountObservedFromMigration (dynamic regex over migration text): ${evidence.actualKnowledgeTableCountObservedFromMigration}`,
      `rlsEnabledTableCountObservedFromMigration: ${evidence.rlsEnabledTableCountObservedFromMigration}`,
      `existingKnowledgeTablesPreserved: ${evidence.existingKnowledgeTablesPreserved}`,
      `phase9IInspected: ${evidence.phase9IInspected} (checkId 9I found: ${evidence.phase9IReportsCheckId9I})`,
      `phase9JInspected (expected source check id ${SOURCE_PACK_PLAN_CHECK_ID}): ${evidence.phase9JInspected} (checkId 9J found: ${evidence.phase9JReportsCheckId9J}, blockingGapCount 2 found: ${evidence.phase9JReportsBlockingGapCount2})`,
      "This audit read only committed plain text for migration 032, the PHASE 9I audit file and the PHASE 9J audit file — none was imported, executed, or modified.",
      "Zero SQL created, zero migrations applied, zero databases (local or remote) touched, zero Docker/Supabase processes started, zero sources fetched, zero rows inserted, zero runtime retrieval activated, zero publication performed.",
      ...evidence.notes,
    ],
  };
}

// ============================================================================
// ENTRY POINT
// ============================================================================

export function runPublicationAndCanonicalTranslationSchemaExtensionDesignAudit(): Result {
  const evidence = collectEvidence();
  const good = buildGoodResult(evidence);
  const tamperOutcome = runTamperCases(good);

  const allPassed = computeExpectedAllPassed(good) && tamperOutcome.rejected === tamperOutcome.total && good.allPassed;

  return {
    ...good,
    allPassed,
    tamperCasesRejected: tamperOutcome.rejected,
    tamperCasesRejectedCount: tamperOutcome.rejected,
    readyForPublicationAndCanonicalTranslationSchemaExtensionImplementationPlan: allPassed,
    readyForRealGermanSourceIngestion: false,
    readyForControlledDatabaseWrite: false,
    readyForRuntimeRetrieval: false,
    notes: [
      ...good.notes,
      `Tamper rejection: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      ...(tamperOutcome.failures.length > 0 ? [`Tamper failures: ${tamperOutcome.failures.join("; ")}`] : []),
    ],
  };
}

if (require.main === module) {
  const result = runPublicationAndCanonicalTranslationSchemaExtensionDesignAudit();
  console.log(JSON.stringify(result));
}
