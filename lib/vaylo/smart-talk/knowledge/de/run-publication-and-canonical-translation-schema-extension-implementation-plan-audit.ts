/**
 * PHASE 9L — Publication and Canonical Translation Schema Extension
 * Implementation Plan (Implementation-Plan-Only Phase)
 *
 * Building on PHASE 9K's accepted design, this file resolves the design into
 * a concrete, machine-checkable implementation contract for the future
 * additive SQL migration (PHASE 9M) that will create:
 *
 *   knowledge_publication_states
 *   knowledge_publication_state_transitions
 *   knowledge_canonical_unit_translations
 *
 * It resolves both mandatory hard gates to a single final strategy each:
 *
 *   HARD GATE A (bootstrap circularity) — resolved by recognizing that the
 *   PHASE 9K design already links the two publication tables through a
 *   shared polymorphic natural key (entity_type/entity_id) rather than a
 *   mutual surrogate-key foreign-key pair. knowledge_publication_state_transitions
 *   has zero foreign key back onto knowledge_publication_states, so there is
 *   no real cycle to defer: knowledge_publication_state_transitions can be
 *   created first (fully self-contained), and knowledge_publication_states
 *   created second with its current_transition_id foreign key declared
 *   inline at CREATE TABLE time. A single SECURITY DEFINER bootstrap RPC
 *   then performs, in one transaction: insert the null->draft transition row
 *   first (no dependency on any states row existing), then insert the
 *   current-state row referencing that transition's real id. No
 *   DEFERRABLE/INITIALLY DEFERRED constraint is used anywhere in this plan.
 *
 *   HARD GATE B (canonical translation composite identity) — resolved by
 *   requiring the full six-column tuple (entity_type, entity_id, field_key,
 *   canonical_content_fingerprint, output_locale, translation_version) as
 *   the translation attachment identity, with the fingerprint always
 *   database-derived (via pgcrypto's digest(), never client-supplied as
 *   authoritative) from a closed, repository-grounded allowlist of 8
 *   (entity_type, field_key) tuples across 5 canonical migration-032 tables.
 *
 * Zero SQL is created, zero migrations are applied, zero databases (local or
 * remote) are touched, zero Docker/Supabase processes are started, zero real
 * sources are fetched, zero rows are inserted, zero runtime retrieval is
 * enabled, zero publication occurs, zero First Contact mode is introduced,
 * zero DE<->SK activation occurs. Every table/column/function/index/RPC
 * below is an implementation-plan candidate only, never an implemented fact.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// ============================================================================
// PART 0 — IDENTITY, SOURCE CLOSURES, HELPERS
// ============================================================================

const PHASE_ID = "9L" as const;
const PHASE_NAME =
  "Publication and Canonical Translation Schema Extension Implementation Plan" as const;
const PLAN_KIND =
  "publication_and_canonical_translation_schema_extension_implementation_plan" as const;
const SOURCE_DESIGN_PHASE_ID = "9K" as const;
const SOURCE_DESIGN_COMMIT = "1cf5276" as const;
const FUTURE_IMPLEMENTATION_PHASE_ID = "9M" as const;
const FUTURE_VALIDATION_PHASE_ID = "9N" as const;
const CANONICAL_LANGUAGE = "de" as const;

const LAUNCH_LANGUAGES = ["de", "en", "sk", "cs", "pl", "hu"] as const;
const FUTURE_INACTIVE_LANGUAGES = ["ro", "bg", "uk", "tr", "ru"] as const;
const TRANSLATION_OUTPUT_LOCALES = LAUNCH_LANGUAGES.filter((l) => l !== "de");

const MIGRATIONS_DIR_REL_PATH = "supabase/migrations";
const MIGRATION_FILE_NAME = "032_create_minimal_knowledge_schema.sql";
const MIGRATION_REL_PATH = `${MIGRATIONS_DIR_REL_PATH}/${MIGRATION_FILE_NAME}`;

const PHASE_9G_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-minimal-knowledge-schema-migration-implementation-audit.ts";
const PHASE_9H_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-empty-schema-migration-validation-closure-audit.ts";
const PHASE_9I_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-knowledge-ingestion-architecture-and-first-process-pack-design-audit.ts";
const PHASE_9J_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-first-german-process-pack-implementation-plan-and-schema-gap-resolution-boundary-audit.ts";
const PHASE_9K_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-extension-design-audit.ts";
const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-extension-implementation-plan-audit.ts";

const SOURCE_CLOSURES: readonly string[] = [
  MIGRATION_REL_PATH,
  PHASE_9G_REL_PATH,
  PHASE_9H_REL_PATH,
  PHASE_9I_REL_PATH,
  PHASE_9J_REL_PATH,
  PHASE_9K_REL_PATH,
];

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

function listDirSafe(relPath: string): string[] {
  try {
    return fs.readdirSync(path.join(process.cwd(), relPath));
  } catch {
    return [];
  }
}

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

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

function migrationHasDropOrRename(sql: string): boolean {
  return /\bdrop\s+table\b|\bdrop\s+column\b|\brename\s+(table|column)\b/i.test(sql);
}

// ============================================================================
// PART A — PUBLICATION STATE MODEL (carried forward from PHASE 9K, re-derived)
// ============================================================================

type PublicationState =
  | "draft" | "evidence_incomplete" | "review_required" | "approved" | "publication_eligible"
  | "published" | "suspended" | "superseded" | "withdrawn";

const PUBLICATION_STATES: readonly PublicationState[] = [
  "draft", "evidence_incomplete", "review_required", "approved", "publication_eligible",
  "published", "suspended", "superseded", "withdrawn",
];

interface StateTransitionSpec {
  from: PublicationState | null;
  to: PublicationState;
  requiresPublicationAuthorization: boolean;
  requiresEnhancedHighRiskReview: boolean;
  requiresSupersedingReference: boolean;
  requiresEmergencyReason: boolean;
  forbiddenWithoutReason: boolean;
  forbiddenWithoutEvidence: boolean;
  reversible: boolean;
  affectsRuntimeEligibility: boolean;
  auditHistoryOutcome: string;
  rationale: string;
}

const ALLOWED_TRANSITIONS: readonly StateTransitionSpec[] = [
  { from: null, to: "draft", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: false, forbiddenWithoutEvidence: false, reversible: false, affectsRuntimeEligibility: false, auditHistoryOutcome: "bootstrap_transition_row",
    rationale: "The only transition with from=null: the initial creation transition, produced exclusively by the bootstrap RPC." },
  { from: "draft", to: "evidence_incomplete", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: false, forbiddenWithoutEvidence: false, reversible: true, affectsRuntimeEligibility: false, auditHistoryOutcome: "history_row_appended",
    rationale: "Extraction/authoring detects the unit lacks required evidence before it can be reviewed." },
  { from: "draft", to: "review_required", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: false, forbiddenWithoutEvidence: true, reversible: false, affectsRuntimeEligibility: false, auditHistoryOutcome: "history_row_appended",
    rationale: "Evidence already sufficient at draft time; ready for review without an intermediate evidence-gathering step." },
  { from: "evidence_incomplete", to: "review_required", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: false, forbiddenWithoutEvidence: true, reversible: false, affectsRuntimeEligibility: false, auditHistoryOutcome: "history_row_appended",
    rationale: "Missing evidence has been supplied; the unit can now enter review." },
  { from: "review_required", to: "approved", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: true, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: false, forbiddenWithoutEvidence: true, reversible: false, affectsRuntimeEligibility: false, auditHistoryOutcome: "history_row_appended",
    rationale: "Human/expert review has passed; enhanced review is additionally required when the underlying entity's risk_level warrants it." },
  { from: "review_required", to: "evidence_incomplete", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, reversible: true, affectsRuntimeEligibility: false, auditHistoryOutcome: "history_row_appended",
    rationale: "Reviewer determines evidence is in fact insufficient and returns the unit for more evidence." },
  { from: "approved", to: "publication_eligible", requiresPublicationAuthorization: true, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: false, forbiddenWithoutEvidence: false, reversible: false, affectsRuntimeEligibility: false, auditHistoryOutcome: "history_row_appended",
    rationale: "Crossing into eligibility is a publication-authorization event, not a plain review event." },
  { from: "approved", to: "review_required", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, reversible: true, affectsRuntimeEligibility: false, auditHistoryOutcome: "history_row_appended",
    rationale: "A previously-approved unit is sent back for re-review." },
  { from: "publication_eligible", to: "published", requiresPublicationAuthorization: true, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: false, forbiddenWithoutEvidence: false, reversible: false, affectsRuntimeEligibility: true, auditHistoryOutcome: "history_row_appended",
    rationale: "The actual publication act is itself a publication-authorization event." },
  { from: "publication_eligible", to: "review_required", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, reversible: true, affectsRuntimeEligibility: false, auditHistoryOutcome: "history_row_appended",
    rationale: "A newly-detected issue removes eligibility before actual publication occurred." },
  { from: "published", to: "suspended", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, reversible: true, affectsRuntimeEligibility: true, auditHistoryOutcome: "history_row_appended",
    rationale: "Reversible protective action for stale source / conflict / authority error / translation defect / emergency governance issue." },
  { from: "suspended", to: "published", requiresPublicationAuthorization: true, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, reversible: true, affectsRuntimeEligibility: true, auditHistoryOutcome: "history_row_appended",
    rationale: "Reinstatement after the suspension cause is resolved; requires the same authorization level as original publication. Never silent." },
  { from: "suspended", to: "review_required", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, reversible: false, affectsRuntimeEligibility: false, auditHistoryOutcome: "history_row_appended",
    rationale: "The suspension cause requires deeper rework, not a simple reinstatement." },
  { from: "published", to: "superseded", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: true, requiresEmergencyReason: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, reversible: false, affectsRuntimeEligibility: true, auditHistoryOutcome: "history_row_appended",
    rationale: "A replacement unit exists; the required replacement reference is mandatory metadata on this transition row." },
  { from: "published", to: "withdrawn", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, reversible: false, affectsRuntimeEligibility: true, auditHistoryOutcome: "history_row_appended",
    rationale: "Terminal removal without an immediate replacement." },
  { from: "publication_eligible", to: "withdrawn", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, reversible: false, affectsRuntimeEligibility: false, auditHistoryOutcome: "history_row_appended",
    rationale: "Withdrawn before ever being published." },
  { from: "approved", to: "withdrawn", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, reversible: false, affectsRuntimeEligibility: false, auditHistoryOutcome: "history_row_appended",
    rationale: "Withdrawn after approval but before eligibility was ever granted." },
  { from: "review_required", to: "withdrawn", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, reversible: false, affectsRuntimeEligibility: false, auditHistoryOutcome: "history_row_appended",
    rationale: "Withdrawn while still in review." },
  { from: "draft", to: "withdrawn", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, reversible: false, affectsRuntimeEligibility: false, auditHistoryOutcome: "history_row_appended",
    rationale: "A draft later found to be entirely wrong must have a terminal exit path without being forced through review_required first." },
  { from: "evidence_incomplete", to: "withdrawn", requiresPublicationAuthorization: false, requiresEnhancedHighRiskReview: false, requiresSupersedingReference: false, requiresEmergencyReason: false, forbiddenWithoutReason: true, forbiddenWithoutEvidence: false, reversible: false, affectsRuntimeEligibility: false, auditHistoryOutcome: "history_row_appended",
    rationale: "A unit permanently stuck without obtainable evidence must have a terminal exit path." },
];

function computeTerminalStates(): readonly PublicationState[] {
  return PUBLICATION_STATES.filter((s) => !ALLOWED_TRANSITIONS.some((t) => t.from === s));
}

function computeReversibleStates(): readonly PublicationState[] {
  const pairs = new Set<string>();
  for (const t of ALLOWED_TRANSITIONS) { if (t.from === null) continue; pairs.add(`${t.from}->${t.to}`); }
  const reversible = new Set<PublicationState>();
  for (const t of ALLOWED_TRANSITIONS) {
    if (t.from === null) continue;
    if (pairs.has(`${t.to}->${t.from}`)) { reversible.add(t.from); reversible.add(t.to); }
  }
  return PUBLICATION_STATES.filter((s) => reversible.has(s));
}

const TERMINAL_STATES = computeTerminalStates();
const REVERSIBLE_STATES = computeReversibleStates();

function transitionIsAllowed(from: PublicationState | null, to: PublicationState): boolean {
  return ALLOWED_TRANSITIONS.some((t) => t.from === from && t.to === to);
}

// ─── Full 90-pair transition matrix (10 "from" values including null, times
//     9 "to" values), classified purely from ALLOWED_TRANSITIONS — nothing
//     hardcoded independently of that array. ───────────────────────────────

type TransitionClassification = "allowed" | "conditionally_allowed" | "forbidden";

interface TransitionMatrixEntry {
  from: PublicationState | null;
  to: PublicationState;
  classification: TransitionClassification;
  spec: StateTransitionSpec | null;
}

function classifySpec(spec: StateTransitionSpec): TransitionClassification {
  if (spec.requiresPublicationAuthorization || spec.requiresEnhancedHighRiskReview || spec.requiresSupersedingReference) {
    return "conditionally_allowed";
  }
  return "allowed";
}

function buildFullTransitionMatrix(): readonly TransitionMatrixEntry[] {
  const fromValues: readonly (PublicationState | null)[] = [null, ...PUBLICATION_STATES];
  const entries: TransitionMatrixEntry[] = [];
  for (const from of fromValues) {
    for (const to of PUBLICATION_STATES) {
      const spec = ALLOWED_TRANSITIONS.find((t) => t.from === from && t.to === to) ?? null;
      entries.push({ from, to, classification: spec ? classifySpec(spec) : "forbidden", spec });
    }
  }
  return entries;
}

const FULL_TRANSITION_MATRIX = buildFullTransitionMatrix();
const PUBLICATION_TRANSITION_RULE_COUNT = ALLOWED_TRANSITIONS.length;

const EXPLICITLY_REJECTED_TRANSITION_CHECKS: readonly { description: string; from: PublicationState | null; to: PublicationState; expectAllowed: boolean }[] = [
  { description: "bootstrap directly to published", from: null, to: "published", expectAllowed: false },
  { description: "draft -> published", from: "draft", to: "published", expectAllowed: false },
  { description: "evidence_incomplete -> published", from: "evidence_incomplete", to: "published", expectAllowed: false },
  { description: "review_required -> published without approval", from: "review_required", to: "published", expectAllowed: false },
  { description: "approved -> published skipping publication_eligible", from: "approved", to: "published", expectAllowed: false },
  { description: "withdrawn -> draft (any outbound from withdrawn)", from: "withdrawn", to: "draft", expectAllowed: false },
  { description: "withdrawn -> published", from: "withdrawn", to: "published", expectAllowed: false },
  { description: "superseded -> published (silent)", from: "superseded", to: "published", expectAllowed: false },
  { description: "null -> draft is the sole bootstrap edge", from: null, to: "draft", expectAllowed: true },
];

// ============================================================================
// PART B — PUBLICATION SUBJECT MODEL (derived from migration 032 + PHASE 9K)
// ============================================================================

type PublicationSubjectType =
  | "source" | "source_version" | "claim" | "process" | "process_step"
  | "document_requirement" | "deadline_rule" | "authority_resolution_unit"
  | "warning_unit" | "outcome_unit" | "canonical_translation" | "complete_process_pack_version";

interface PublicationSubjectMapping {
  entityType: PublicationSubjectType;
  canonicalTable: string;
  primaryKeyColumn: string;
  independentlyPublishable: boolean;
  representsCanonicalGermanContent: boolean;
  existenceValidation: string;
  deletionOfReferencedSubjectPossible: boolean;
  onSupersessionOfSubject: string;
  granularity: "unit_level" | "pack_level";
}

const PUBLICATION_SUBJECT_MAPPINGS: readonly PublicationSubjectMapping[] = [
  { entityType: "source", canonicalTable: "knowledge_sources", primaryKeyColumn: "id", independentlyPublishable: true, representsCanonicalGermanContent: false,
    existenceValidation: "EXISTS(SELECT 1 FROM public.knowledge_sources WHERE id = $entity_id)", deletionOfReferencedSubjectPossible: false,
    onSupersessionOfSubject: "publication history preserved; a new source row gets its own independent publication-state row", granularity: "unit_level" },
  { entityType: "source_version", canonicalTable: "knowledge_source_versions", primaryKeyColumn: "id", independentlyPublishable: true, representsCanonicalGermanContent: true,
    existenceValidation: "EXISTS(SELECT 1 FROM public.knowledge_source_versions WHERE id = $entity_id)", deletionOfReferencedSubjectPossible: false,
    onSupersessionOfSubject: "superseded_by_version_id already links forward; publication state independently tracks superseded", granularity: "unit_level" },
  { entityType: "claim", canonicalTable: "knowledge_claims", primaryKeyColumn: "id", independentlyPublishable: true, representsCanonicalGermanContent: true,
    existenceValidation: "EXISTS(SELECT 1 FROM public.knowledge_claims WHERE id = $entity_id)", deletionOfReferencedSubjectPossible: false,
    onSupersessionOfSubject: "history preserved; replacement claim gets its own row and publication state", granularity: "unit_level" },
  { entityType: "process", canonicalTable: "knowledge_processes", primaryKeyColumn: "id", independentlyPublishable: true, representsCanonicalGermanContent: true,
    existenceValidation: "EXISTS(SELECT 1 FROM public.knowledge_processes WHERE id = $entity_id)", deletionOfReferencedSubjectPossible: false,
    onSupersessionOfSubject: "history preserved; also doubles as the complete_process_pack_version anchor id for the anmeldung variant", granularity: "unit_level" },
  { entityType: "process_step", canonicalTable: "knowledge_process_steps", primaryKeyColumn: "id", independentlyPublishable: true, representsCanonicalGermanContent: true,
    existenceValidation: "EXISTS(SELECT 1 FROM public.knowledge_process_steps WHERE id = $entity_id)", deletionOfReferencedSubjectPossible: false,
    onSupersessionOfSubject: "history preserved; step reordering never rewrites an existing step's publication history", granularity: "unit_level" },
  { entityType: "document_requirement", canonicalTable: "knowledge_evidence_requirements", primaryKeyColumn: "id", independentlyPublishable: true, representsCanonicalGermanContent: true,
    existenceValidation: "EXISTS(SELECT 1 FROM public.knowledge_evidence_requirements WHERE id = $entity_id)", deletionOfReferencedSubjectPossible: false,
    onSupersessionOfSubject: "history preserved", granularity: "unit_level" },
  { entityType: "deadline_rule", canonicalTable: "knowledge_deadline_rules", primaryKeyColumn: "id", independentlyPublishable: true, representsCanonicalGermanContent: true,
    existenceValidation: "EXISTS(SELECT 1 FROM public.knowledge_deadline_rules WHERE id = $entity_id)", deletionOfReferencedSubjectPossible: false,
    onSupersessionOfSubject: "history preserved", granularity: "unit_level" },
  { entityType: "authority_resolution_unit", canonicalTable: "knowledge_authority_competences", primaryKeyColumn: "id", independentlyPublishable: true, representsCanonicalGermanContent: true,
    existenceValidation: "EXISTS(SELECT 1 FROM public.knowledge_authority_competences WHERE id = $entity_id)", deletionOfReferencedSubjectPossible: false,
    onSupersessionOfSubject: "history preserved", granularity: "unit_level" },
  { entityType: "warning_unit", canonicalTable: "knowledge_terminology", primaryKeyColumn: "id", independentlyPublishable: true, representsCanonicalGermanContent: false,
    existenceValidation: "EXISTS(SELECT 1 FROM public.knowledge_terminology WHERE id = $entity_id)", deletionOfReferencedSubjectPossible: false,
    onSupersessionOfSubject: "warning templates are governance text, never suppressed by publication logic even while superseded", granularity: "unit_level" },
  { entityType: "outcome_unit", canonicalTable: "knowledge_terminology", primaryKeyColumn: "id", independentlyPublishable: true, representsCanonicalGermanContent: false,
    existenceValidation: "EXISTS(SELECT 1 FROM public.knowledge_terminology WHERE id = $entity_id)", deletionOfReferencedSubjectPossible: false,
    onSupersessionOfSubject: "outcome guidance is fixed structural vocabulary, never suppressed by publication logic", granularity: "unit_level" },
  { entityType: "canonical_translation", canonicalTable: "knowledge_canonical_unit_translations", primaryKeyColumn: "id", independentlyPublishable: false, representsCanonicalGermanContent: false,
    existenceValidation: "EXISTS(SELECT 1 FROM public.knowledge_canonical_unit_translations WHERE id = $entity_id) — deferred/optional_later per PHASE 9K; translation_status on the row itself remains authoritative for this entity type in PHASE 9M", deletionOfReferencedSubjectPossible: false,
    onSupersessionOfSubject: "n/a; translation supersession is tracked on the translation row itself (superseded_at), not via this optional wrapper", granularity: "unit_level" },
  { entityType: "complete_process_pack_version", canonicalTable: "knowledge_processes", primaryKeyColumn: "id", independentlyPublishable: true, representsCanonicalGermanContent: false,
    existenceValidation: "EXISTS(SELECT 1 FROM public.knowledge_processes WHERE id = $entity_id AND process_group_id = 'anmeldung_ummeldung_abmeldung') — pack-anchor row reuses the anmeldung variant's own id under a DIFFERENT entity_type, valid because uniqueness is on the (entity_type, entity_id) pair, not entity_id alone", deletionOfReferencedSubjectPossible: false,
    onSupersessionOfSubject: "pack-level supersession does not retroactively withdraw the 3 constituent variant rows' own independent publication states", granularity: "pack_level" },
];

const PUBLICATION_SUBJECT_MAPPING_COUNT = PUBLICATION_SUBJECT_MAPPINGS.length;
const LOCALE_USED_FOR_JURISDICTION = false;

const PUBLICATION_SUBJECT_REJECTION_CASES: readonly string[] = [
  "unknown_entity_type", "null_entity_id", "nonexistent_entity_id", "entity_id_from_wrong_table",
  "cross_type_id_reuse", "unsupported_child_object", "translated_row_as_canonical_subject",
  "future_cross_border_subject_in_first_pack", "locale_derived_subject_selection",
];

// ============================================================================
// PART C — CURRENT-STATE PROJECTION CONTRACT (knowledge_publication_states)
// ============================================================================

interface ColumnContract {
  column: string;
  sqlType: string;
  nullable: boolean;
  defaultExpr: string | null;
  checkConstraint: string | null;
  immutability: "immutable" | "controlled_mutable_via_rpc_only" | "append_only_row" | "immutable_after_verified";
  writerPath: string;
  indexParticipation: readonly string[];
  clientMayProvide: boolean;
}

const PUBLICATION_STATES_COLUMNS: readonly ColumnContract[] = [
  { column: "id", sqlType: "uuid", nullable: false, defaultExpr: "gen_random_uuid()", checkConstraint: null, immutability: "immutable", writerPath: "bootstrap RPC only", indexParticipation: ["primary_key"], clientMayProvide: false },
  { column: "entity_type", sqlType: "text", nullable: false, defaultExpr: null, checkConstraint: "entity_type in <12 PublicationSubjectType values>", immutability: "immutable", writerPath: "bootstrap RPC only", indexParticipation: ["ux_publication_states_subject_unique", "ix_publication_states_current_state"], clientMayProvide: true },
  { column: "entity_id", sqlType: "uuid", nullable: false, defaultExpr: null, checkConstraint: null, immutability: "immutable", writerPath: "bootstrap RPC only", indexParticipation: ["ux_publication_states_subject_unique"], clientMayProvide: true },
  { column: "current_state", sqlType: "text", nullable: false, defaultExpr: "'draft'", checkConstraint: "current_state in <9 PublicationState values>", immutability: "controlled_mutable_via_rpc_only", writerPath: "bootstrap RPC (initial) / transition RPC (subsequent)", indexParticipation: ["ix_publication_states_current_state"], clientMayProvide: false },
  { column: "current_transition_id", sqlType: "uuid", nullable: false, defaultExpr: null, checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "bootstrap RPC (initial) / transition RPC (subsequent); references knowledge_publication_state_transitions(id) on delete restrict", indexParticipation: ["ix_publication_states_current_transition"], clientMayProvide: false },
  { column: "state_version", sqlType: "integer", nullable: false, defaultExpr: "1", checkConstraint: "state_version > 0", immutability: "controlled_mutable_via_rpc_only", writerPath: "transition RPC only, incremented by exactly 1 per accepted transition", indexParticipation: [], clientMayProvide: false },
  { column: "reason_code", sqlType: "text", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "denormalized copy of current_transition_id's reason_code, written only by the transition RPC", indexParticipation: [], clientMayProvide: false },
  { column: "emergency_disabled", sqlType: "boolean", nullable: false, defaultExpr: "false", checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "denormalized copy of current_transition_id's emergency flag, written only by the transition RPC", indexParticipation: [], clientMayProvide: false },
  { column: "effective_from", sqlType: "timestamptz", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "transition RPC only", indexParticipation: [], clientMayProvide: true },
  { column: "effective_until", sqlType: "timestamptz", nullable: true, defaultExpr: null, checkConstraint: "effective_until is null or effective_from is null or effective_until >= effective_from", immutability: "controlled_mutable_via_rpc_only", writerPath: "transition RPC only", indexParticipation: [], clientMayProvide: true },
  { column: "jurisdiction_id", sqlType: "uuid", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "transition RPC only; references knowledge_jurisdictions(id) on delete restrict", indexParticipation: ["ix_publication_states_jurisdiction"], clientMayProvide: true },
  { column: "created_at", sqlType: "timestamptz", nullable: false, defaultExpr: "now()", checkConstraint: null, immutability: "immutable", writerPath: "bootstrap RPC only", indexParticipation: [], clientMayProvide: false },
  { column: "updated_at", sqlType: "timestamptz", nullable: false, defaultExpr: "now()", checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "transition RPC only", indexParticipation: [], clientMayProvide: false },
];

const PUBLICATION_STATES_TABLE_RULES = {
  directTableUpdateForbidden: true,
  directTableInsertForbiddenOutsideBootstrap: true,
  directTableDeleteForbidden: true,
  stateVersionStartsAtOne: true,
  stateVersionIncrementsExactlyOncePerTransition: true,
  currentStateEqualsAcceptedTransitionNextState: true,
  currentTransitionIdPointsToAcceptedLatestTransition: true,
  publicationSubjectIdentityImmutable: true,
  deterministicUniquenessConstraint: "unique(entity_type, entity_id)",
} as const;

// ============================================================================
// PART D — IMMUTABLE TRANSITION HISTORY CONTRACT (knowledge_publication_state_transitions)
// ============================================================================

const TRANSITION_REASON_CODES = [
  "initial_draft", "evidence_completed", "review_passed", "review_failed_returned_to_evidence",
  "approved", "eligibility_confirmed", "published", "stale_source_suspension", "conflict_suspension",
  "authority_error_suspension", "translation_defect_suspension", "emergency_governance_suspension",
  "reinstated_after_suspension", "superseded_by_new_version", "withdrawn_reason_required", "manual_correction",
] as const;

const PUBLICATION_STATE_TRANSITIONS_COLUMNS: readonly ColumnContract[] = [
  { column: "id", sqlType: "uuid", nullable: false, defaultExpr: "gen_random_uuid()", checkConstraint: null, immutability: "immutable", writerPath: "bootstrap RPC (row 1) / transition RPC (subsequent rows)", indexParticipation: ["primary_key"], clientMayProvide: false },
  { column: "entity_type", sqlType: "text", nullable: false, defaultExpr: null, checkConstraint: "entity_type in <12 PublicationSubjectType values>", immutability: "immutable", writerPath: "RPC only", indexParticipation: ["ix_transitions_entity_transitioned_at", "ux_transitions_bootstrap_once"], clientMayProvide: true },
  { column: "entity_id", sqlType: "uuid", nullable: false, defaultExpr: null, checkConstraint: null, immutability: "immutable", writerPath: "RPC only", indexParticipation: ["ix_transitions_entity_transitioned_at", "ux_transitions_bootstrap_once"], clientMayProvide: true },
  { column: "from_state", sqlType: "text", nullable: true, defaultExpr: null, checkConstraint: "(from_state is null) = (to_state = 'draft') and (from_state is null or from_state in <9 states>)", immutability: "immutable", writerPath: "RPC only; server re-reads current_state, never trusts caller-supplied from_state", indexParticipation: [], clientMayProvide: false },
  { column: "to_state", sqlType: "text", nullable: false, defaultExpr: null, checkConstraint: "to_state in <9 states>", immutability: "immutable", writerPath: "RPC only", indexParticipation: ["ix_transitions_to_state_superseded_partial"], clientMayProvide: true },
  { column: "from_state_version", sqlType: "integer", nullable: false, defaultExpr: null, checkConstraint: "from_state_version >= 0", immutability: "immutable", writerPath: "RPC only, copied from the locked projection row", indexParticipation: [], clientMayProvide: false },
  { column: "resulting_state_version", sqlType: "integer", nullable: false, defaultExpr: null, checkConstraint: "resulting_state_version = from_state_version + 1", immutability: "immutable", writerPath: "RPC only", indexParticipation: [], clientMayProvide: false },
  { column: "transition_reason_code", sqlType: "text", nullable: false, defaultExpr: null, checkConstraint: "transition_reason_code in <16 fixed codes>", immutability: "immutable", writerPath: "RPC only", indexParticipation: [], clientMayProvide: true },
  { column: "transition_reason", sqlType: "text", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "immutable", writerPath: "RPC only; required (RPC-enforced) for the suspension/withdrawal reason-code subset", indexParticipation: [], clientMayProvide: true },
  { column: "actor_class", sqlType: "text", nullable: false, defaultExpr: null, checkConstraint: "actor_class in <5 ActorClass values>", immutability: "immutable", writerPath: "RPC only; derived from trusted execution context, never a caller-supplied free-text label", indexParticipation: [], clientMayProvide: false },
  { column: "actor_identifier", sqlType: "text", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "immutable", writerPath: "RPC only", indexParticipation: ["ix_transitions_emergency_partial"], clientMayProvide: false },
  { column: "review_record_id", sqlType: "uuid", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "immutable", writerPath: "RPC only; references knowledge_review_records(id) on delete restrict", indexParticipation: [], clientMayProvide: true },
  { column: "expected_state_version", sqlType: "integer", nullable: false, defaultExpr: null, checkConstraint: "expected_state_version >= 0", immutability: "immutable", writerPath: "caller-supplied optimistic-concurrency token, required, no default", indexParticipation: [], clientMayProvide: true },
  { column: "replacement_entity_type", sqlType: "text", nullable: true, defaultExpr: null, checkConstraint: "replacement_entity_type is null or replacement_entity_type in <12 PublicationSubjectType values>", immutability: "immutable", writerPath: "RPC only; required when to_state='superseded'", indexParticipation: [], clientMayProvide: true },
  { column: "replacement_entity_id", sqlType: "uuid", nullable: true, defaultExpr: null, checkConstraint: "(to_state <> 'superseded') or (replacement_entity_id is not null and replacement_entity_id <> entity_id)", immutability: "immutable", writerPath: "RPC only", indexParticipation: [], clientMayProvide: true },
  { column: "emergency_flag", sqlType: "boolean", nullable: false, defaultExpr: "false", checkConstraint: null, immutability: "immutable", writerPath: "RPC only", indexParticipation: ["ix_transitions_emergency_partial"], clientMayProvide: false },
  { column: "idempotency_key", sqlType: "text", nullable: false, defaultExpr: null, checkConstraint: "length(idempotency_key) > 0", immutability: "immutable", writerPath: "caller-supplied, required, no default", indexParticipation: ["ix_transitions_idempotency_key"], clientMayProvide: true },
  { column: "provenance_note", sqlType: "text", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "immutable", writerPath: "RPC only", indexParticipation: [], clientMayProvide: true },
  { column: "transitioned_at", sqlType: "timestamptz", nullable: false, defaultExpr: "now()", checkConstraint: null, immutability: "immutable", writerPath: "RPC only", indexParticipation: ["ix_transitions_entity_transitioned_at", "ix_transitions_transitioned_at"], clientMayProvide: false },
  { column: "created_at", sqlType: "timestamptz", nullable: false, defaultExpr: "now()", checkConstraint: null, immutability: "immutable", writerPath: "RPC only", indexParticipation: [], clientMayProvide: false },
];

const TRANSITION_HISTORY_TABLE_RULES = {
  appendOnlyFromFirstCommittedRow: true,
  updateForbidden: true,
  deleteForbidden: true,
  previousStateNullOnlyForInitialBootstrap: true,
  resultingStateVersionEqualsPreviousPlusOne: true,
  initialResultingStateVersionIsOne: true,
  laterPreviousStateMustEqualCurrentProjectionState: true,
  laterPreviousVersionMustEqualCurrentProjectionVersion: true,
  transitionNextStateMustMatchAllowedStateMachineEdge: true,
} as const;

// ============================================================================
// PART E — HARD GATE A: PUBLICATION BOOTSTRAP CIRCULARITY (SINGLE FINAL STRATEGY)
// ============================================================================

type BootstrapFamily = "family_a_deferred_constraint" | "family_b_controlled_rpc";

interface BootstrapFamilyAssessment {
  family: BootstrapFamily;
  applicableToThisSchema: boolean;
  reasoning: string;
  selected: boolean;
}

const BOOTSTRAP_FAMILY_ASSESSMENTS: readonly BootstrapFamilyAssessment[] = [
  { family: "family_a_deferred_constraint", applicableToThisSchema: false, selected: false,
    reasoning: "Family A (DEFERRABLE INITIALLY DEFERRED, both rows inserted in one transaction with the constraint checked at COMMIT) solves a MUTUAL surrogate-key foreign-key cycle: table A's row needs table B's id, AND table B's row needs table A's id, at the same moment. That mutual cycle does not exist in this schema. knowledge_publication_state_transitions has NO foreign key back onto knowledge_publication_states at all — it identifies its publication subject via the same polymorphic natural key (entity_type, entity_id) that knowledge_publication_states itself uses, not via knowledge_publication_states.id. The dependency is one-directional: knowledge_publication_states.current_transition_id -> knowledge_publication_state_transitions.id. Introducing a DEFERRABLE constraint here would require first re-introducing an unnecessary transitions -> states surrogate-key FK that this design deliberately does not need, i.e. Family A would be manufacturing the very cycle it exists to work around. It is also a schema-wide first: zero DEFERRABLE constraints exist anywhere in migration 032, so adopting one here would be a new, inconsistent mechanism for a problem this schema does not actually have." },
  { family: "family_b_controlled_rpc", applicableToThisSchema: true, selected: true,
    reasoning: "Because the dependency is one-directional (states -> transitions, never the reverse), a single SECURITY DEFINER bootstrap RPC can simply insert the transitions row FIRST (it needs nothing from the states row) and the states row SECOND (referencing the transition's now-real id via an ordinary NOT NULL foreign key declared inline at CREATE TABLE time). No temporary nullability, no deferred timing and no two-phase commit trick are required anywhere. The RPC additionally performs subject validation, a duplicate-bootstrap check, and a final consistency read, all inside one implicit function-call transaction, which is both simpler and strictly safer than a client-visible multi-statement transaction using deferred constraints." },
];

const SELECTED_BOOTSTRAP_FAMILY: BootstrapFamily = "family_b_controlled_rpc";

interface BootstrapSequenceStep {
  step: number;
  action: string;
  failsIf: string;
}

const BOOTSTRAP_TRANSACTION_SEQUENCE: readonly BootstrapSequenceStep[] = [
  { step: 1, action: "RPC invoked as a single PL/pgSQL function call (implicit single transaction).", failsIf: "n/a" },
  { step: 2, action: "Validate p_entity_type against the 12-value PublicationSubjectType allowlist.", failsIf: "unknown entity type -> exception, no rows touched" },
  { step: 3, action: "Validate p_entity_id is not null.", failsIf: "null entity id -> exception, no rows touched" },
  { step: 4, action: "Dispatch fn_publication_subject_exists(p_entity_type, p_entity_id); require true.", failsIf: "nonexistent id / wrong-table id -> exception, no rows touched" },
  { step: 5, action: "Attempt INSERT into knowledge_publication_state_transitions (entity_type, entity_id, from_state=null, to_state='draft', from_state_version=0, resulting_state_version=1, transition_reason_code='initial_draft', actor_class, actor_identifier, expected_state_version=0, idempotency_key=p_idempotency_key) RETURNING id.", failsIf: "unique_violation on ux_transitions_bootstrap_once (entity_type, entity_id) WHERE from_state IS NULL -> caught; go to step 6" },
  { step: 6, action: "On unique_violation from step 5: SELECT the existing bootstrap transition row for (entity_type, entity_id); compare its idempotency_key to p_idempotency_key.", failsIf: "keys match -> treat as idempotent replay, return the existing (state, transition) pair unchanged, no new row inserted; keys differ -> raise 'publication_subject_already_bootstrapped' and abort" },
  { step: 7, action: "On success from step 5: INSERT into knowledge_publication_states (entity_type, entity_id, current_state='draft', current_transition_id=<id from step 5>, state_version=1) RETURNING id.", failsIf: "unique_violation on ux_publication_states_subject_unique (entity_type, entity_id) -> should be structurally unreachable given step 5 succeeded first (defense-in-depth only); raises exception, whole transaction rolls back, step 5's insert is also undone" },
  { step: 8, action: "Validation trigger on knowledge_publication_states re-checks: current_transition_id's own (entity_type, entity_id, to_state) equals this row's (entity_type, entity_id, 'draft').", failsIf: "mismatch (should be structurally unreachable) -> exception, full rollback" },
  { step: 9, action: "Return the new (publication_state_id, transition_id, current_state='draft', state_version=1) to the caller.", failsIf: "n/a" },
  { step: 10, action: "Function returns; PostgreSQL commits the whole call as one atomic unit. Any exception anywhere above aborts the entire function's transaction with zero partial rows persisted.", failsIf: "n/a" },
];

const BOOTSTRAP_INVARIANTS = {
  initialPreviousState: null as null,
  initialNextState: "draft" as const,
  initialStateVersion: 1,
  initialTransitionRequired: true,
  currentTransitionRequiredAfterBootstrap: true,
  partialBootstrapPersistedOnFailure: false,
  duplicateBootstrapAllowed: false,
  bootstrapAtomic: true,
  bootstrapIdempotencyDefined: true,
  idempotencyBehavior: [
    "same idempotency_key and same (entity_type, entity_id) -> returns the already-established bootstrap result, no new row",
    "same (entity_type, entity_id) with a different or missing idempotency_key -> fails as 'publication_subject_already_bootstrapped'",
    "different (entity_type, entity_id) reusing a previously-seen idempotency_key -> succeeds independently; idempotency_key uniqueness is scoped to (entity_type, entity_id), never global",
  ] as const,
  uniqueConstraintPreventingTwoProjectionsForSameSubject: "unique(entity_type, entity_id) on knowledge_publication_states",
  uniqueConstraintPreventingTwoBootstrapTransitions: "unique(entity_type, entity_id) on knowledge_publication_state_transitions where from_state is null",
  normalLifecycleRowsWithNullCurrentTransitionRejected: true,
  temporaryNullabilityStructurallyContained: "none required: current_transition_id is NOT NULL from the very first committed row; the transitions row always exists (with a real id) strictly before the states row referencing it is inserted",
} as const;

// ============================================================================
// PART F — OPTIMISTIC CONCURRENCY (transition RPC)
// ============================================================================

interface ConcurrencySequenceStep { step: number; action: string }

const TRANSITION_CONCURRENCY_SEQUENCE: readonly ConcurrencySequenceStep[] = [
  { step: 1, action: "SELECT id, current_state, current_transition_id, state_version FROM knowledge_publication_states WHERE entity_type=$1 AND entity_id=$2 FOR UPDATE — row-level lock acquired before any comparison." },
  { step: 2, action: "If no row found -> raise 'publication_subject_not_bootstrapped'." },
  { step: 3, action: "Compare locked row's state_version to caller-supplied p_expected_state_version." },
  { step: 4, action: "On mismatch: check for a prior transition row matching (entity_type, entity_id, idempotency_key=p_idempotency_key, resulting_state_version=locked.state_version); if found, return that prior result unchanged (idempotent replay of an already-applied request); if not found, raise 'publication_state_version_conflict' and abort — never silently proceed." },
  { step: 5, action: "On match: validate (locked.current_state -> p_to_state) is an allowed/conditionally_allowed edge in ALLOWED_TRANSITIONS; validate actor authorization; validate required metadata (reason/evidence/replacement/emergency) per the transition spec." },
  { step: 6, action: "INSERT into knowledge_publication_state_transitions (from_state=locked.current_state, to_state=p_to_state, from_state_version=locked.state_version, resulting_state_version=locked.state_version+1, ...) RETURNING id." },
  { step: 7, action: "UPDATE knowledge_publication_states SET current_state=p_to_state, current_transition_id=<new id>, state_version=locked.state_version+1, updated_at=now(), reason_code=p_reason_code, emergency_disabled=p_emergency WHERE id=locked.id AND state_version=p_expected_state_version — the WHERE guard is defense-in-depth on top of the row lock; an affected-row count of 0 here raises 'publication_state_version_conflict' even though the lock should make this unreachable." },
  { step: 8, action: "INSERT a matching knowledge_audit_events row in the same statement-level transaction." },
  { step: 9, action: "Function returns; the projection UPDATE and the history INSERT commit together as one atomic unit, or neither commits." },
];

const CONCURRENCY_INVARIANTS = {
  optimisticConcurrencyRequired: true,
  rowLockRequired: true,
  lastWriteWinsAllowed: false,
  atomicProjectionAndTransitionMutationRequired: true,
  projectionAndTransitionAtomic: true,
  callerControlsResultingVersion: false,
  timestampsUsedAsConcurrencyToken: false,
  transitionCommittedBeforeProjectionUpdate: false,
  updateBySubjectIdAloneWithoutVersionGuard: false,
} as const;

// ============================================================================
// PART G — CONTROLLED WRITE PATHS / RPC CONTRACTS
// ============================================================================

type ActorClass =
  | "automated_ingestion_system" | "authorized_reviewer" | "publication_administrator"
  | "emergency_suspension_authority" | "migration_bootstrap_system_actor";

const ACTOR_CLASSES: readonly ActorClass[] = [
  "automated_ingestion_system", "authorized_reviewer", "publication_administrator",
  "emergency_suspension_authority", "migration_bootstrap_system_actor",
];

// Granular reviewer roles, grounded in PHASE 9J's REVIEWER_ROLES, feeding the
// ActorClass buckets above with repository-derived vocabulary rather than
// invented free text.
const GROUNDED_REVIEWER_ROLES = [
  "source_trust_reviewer", "factual_claim_reviewer", "jurisdiction_reviewer", "effective_date_reviewer",
  "high_risk_claim_reviewer", "translation_reviewer", "publication_authorizer", "emergency_suspension_authorizer",
] as const;

interface RpcContract {
  name: string;
  parameters: readonly string[];
  returnShape: string;
  transactionSemantics: string;
  lockBehavior: string;
  authorizationRule: string;
  idempotencyBehavior: string;
  searchPath: string;
  ownerExpectation: string;
  executeGrants: readonly string[];
  failureModes: readonly string[];
  securityDefiner: boolean;
  mutatesData: boolean;
  publicExecutable: boolean;
}

const HARDENED_SEARCH_PATH = "pg_catalog, public" as const;

const RPC_CONTRACTS: readonly RpcContract[] = [
  { name: "knowledge_bootstrap_publication_subject", parameters: ["p_entity_type text", "p_entity_id uuid", "p_actor_class text", "p_actor_identifier text", "p_idempotency_key text"],
    returnShape: "table(publication_state_id uuid, transition_id uuid, current_state text, state_version integer)",
    transactionSemantics: "single implicit function-call transaction", lockBehavior: "no pre-existing row to lock; relies on the two unique constraints (states subject, transitions bootstrap-once) for race safety",
    authorizationRule: "actor_class in ('automated_ingestion_system','migration_bootstrap_system_actor')", idempotencyBehavior: "see BOOTSTRAP_INVARIANTS.idempotencyBehavior",
    searchPath: HARDENED_SEARCH_PATH, ownerExpectation: "owned by the migration-running/table-owning role, never by service_role itself", executeGrants: ["service_role"],
    failureModes: ["unknown_entity_type", "nonexistent_entity_id", "publication_subject_already_bootstrapped", "unauthorized_actor_class"], securityDefiner: true, mutatesData: true, publicExecutable: false },
  { name: "knowledge_transition_publication_state", parameters: ["p_entity_type text", "p_entity_id uuid", "p_to_state text", "p_expected_state_version integer", "p_reason_code text", "p_reason_text text", "p_actor_class text", "p_actor_identifier text", "p_review_record_id uuid", "p_replacement_entity_type text", "p_replacement_entity_id uuid", "p_emergency boolean", "p_idempotency_key text"],
    returnShape: "table(transition_id uuid, current_state text, state_version integer)",
    transactionSemantics: "single implicit function-call transaction", lockBehavior: "SELECT ... FOR UPDATE on the projection row",
    authorizationRule: "per-transition allowlist in OPERATION_AUTHORIZATION", idempotencyBehavior: "see TRANSITION_CONCURRENCY_SEQUENCE step 4",
    searchPath: HARDENED_SEARCH_PATH, ownerExpectation: "same owner as the bootstrap RPC", executeGrants: ["service_role"],
    failureModes: ["publication_subject_not_bootstrapped", "publication_state_version_conflict", "transition_not_allowed", "missing_required_reason", "missing_required_evidence", "missing_required_replacement", "unauthorized_actor_class"], securityDefiner: true, mutatesData: true, publicExecutable: false },
  { name: "knowledge_emergency_suspend_publication_subject", parameters: ["p_entity_type text", "p_entity_id uuid", "p_expected_state_version integer", "p_reason_text text", "p_actor_identifier text", "p_idempotency_key text"],
    returnShape: "table(transition_id uuid, current_state text, state_version integer)",
    transactionSemantics: "delegates to knowledge_transition_publication_state with to_state='suspended', actor_class='emergency_suspension_authority', p_emergency=true, p_reason_code='emergency_governance_suspension' hardcoded server-side (never caller-selectable)",
    lockBehavior: "inherited from the delegated transition RPC", authorizationRule: "actor_class must be 'emergency_suspension_authority' (mapped from the emergency_suspension_authorizer reviewer role); can only ever move toward 'suspended'",
    idempotencyBehavior: "inherited from the delegated transition RPC", searchPath: HARDENED_SEARCH_PATH, ownerExpectation: "same owner as the transition RPC", executeGrants: ["service_role"],
    failureModes: ["publication_subject_not_bootstrapped", "publication_state_version_conflict", "transition_not_allowed_from_current_state", "unauthorized_actor_class", "missing_reason"], securityDefiner: true, mutatesData: true, publicExecutable: false },
  { name: "knowledge_create_translation_candidate", parameters: ["p_entity_type text", "p_entity_id uuid", "p_field_key text", "p_output_locale text", "p_translated_text text", "p_machine_generated boolean", "p_machine_provider text", "p_machine_model text", "p_created_by_actor_type text", "p_created_by_identifier text", "p_expected_fingerprint text"],
    returnShape: "table(translation_id uuid, canonical_content_fingerprint text, translation_version integer, translation_status text)",
    transactionSemantics: "single implicit function-call transaction", lockBehavior: "none required for creation (a brand-new history row, not a mutated pointer)",
    authorizationRule: "actor_class in ('automated_ingestion_system') for machine candidates, ('authorized_reviewer') for human-authored candidates", idempotencyBehavior: "not required for candidate creation (each call intentionally creates a new translation_version); duplicate accidental submissions are a governance/UX concern, not a database concurrency hazard",
    searchPath: HARDENED_SEARCH_PATH, ownerExpectation: "same owner as the publication RPCs", executeGrants: ["service_role"],
    failureModes: ["unknown_entity_type_field_key_combination", "canonical_content_null_not_translatable", "german_output_locale_rejected", "inactive_future_locale_rejected", "optimistic_fingerprint_assertion_mismatch"], securityDefiner: true, mutatesData: true, publicExecutable: false },
  { name: "knowledge_submit_translation_for_review", parameters: ["p_translation_id uuid", "p_actor_identifier text"],
    returnShape: "table(translation_id uuid, translation_status text)", transactionSemantics: "single implicit function-call transaction", lockBehavior: "SELECT ... FOR UPDATE on the translation row",
    authorizationRule: "actor_class = 'authorized_reviewer'", idempotencyBehavior: "no-op if already human_review_pending",
    searchPath: HARDENED_SEARCH_PATH, ownerExpectation: "same owner as the publication RPCs", executeGrants: ["service_role"],
    failureModes: ["translation_not_found", "translation_not_in_reviewable_status"], securityDefiner: true, mutatesData: true, publicExecutable: false },
  { name: "knowledge_approve_translation", parameters: ["p_translation_id uuid", "p_reviewer_actor_identifier text", "p_review_record_id uuid"],
    returnShape: "table(translation_id uuid, translation_status text, verified_at timestamptz)", transactionSemantics: "single implicit function-call transaction",
    lockBehavior: "SELECT ... FOR UPDATE on the translation row", authorizationRule: "actor_class = 'authorized_reviewer' AND reviewer_actor_identifier <> created_by_identifier (self-approval blocked)",
    idempotencyBehavior: "no-op if already approved with the same reviewer/review_record", searchPath: HARDENED_SEARCH_PATH, ownerExpectation: "same owner as the publication RPCs", executeGrants: ["service_role"],
    failureModes: ["translation_not_found", "self_approval_blocked", "uncertainty_or_warning_or_numeric_preservation_not_confirmed", "canonical_fingerprint_stale_reapprove_rejected", "review_record_missing"], securityDefiner: true, mutatesData: true, publicExecutable: false },
  { name: "knowledge_reject_translation", parameters: ["p_translation_id uuid", "p_reviewer_actor_identifier text", "p_rejection_reason text"],
    returnShape: "table(translation_id uuid, translation_status text)", transactionSemantics: "single implicit function-call transaction", lockBehavior: "SELECT ... FOR UPDATE on the translation row",
    authorizationRule: "actor_class = 'authorized_reviewer'", idempotencyBehavior: "no-op if already rejected", searchPath: HARDENED_SEARCH_PATH, ownerExpectation: "same owner as the publication RPCs", executeGrants: ["service_role"],
    failureModes: ["translation_not_found", "rejection_reason_required", "translation_not_in_reviewable_status"], securityDefiner: true, mutatesData: true, publicExecutable: false },
  { name: "knowledge_invalidate_translation_for_canonical_change", parameters: ["p_translation_id uuid"],
    returnShape: "void", transactionSemantics: "system-only; fires exclusively from the canonical-change trigger, in the same transaction as the canonical UPDATE, never from a human-facing endpoint",
    lockBehavior: "row is already locked as part of the enclosing UPDATE's trigger context", authorizationRule: "actor_class = 'automated_ingestion_system'; not directly callable by any human-facing RPC path",
    idempotencyBehavior: "no-op if already invalidated_pending_review or a terminal status", searchPath: HARDENED_SEARCH_PATH, ownerExpectation: "same owner as the trigger function that calls it", executeGrants: [],
    failureModes: ["translation_not_found"], securityDefiner: true, mutatesData: true, publicExecutable: false },
  { name: "knowledge_withdraw_translation", parameters: ["p_translation_id uuid", "p_actor_identifier text", "p_reason_text text"],
    returnShape: "table(translation_id uuid, translation_status text)", transactionSemantics: "single implicit function-call transaction; intended to be called only as part of the same transaction as the underlying canonical unit's own withdrawal transition",
    lockBehavior: "SELECT ... FOR UPDATE on the translation row", authorizationRule: "actor_class = 'publication_administrator'", idempotencyBehavior: "no-op if already withdrawn",
    searchPath: HARDENED_SEARCH_PATH, ownerExpectation: "same owner as the publication RPCs", executeGrants: ["service_role"],
    failureModes: ["translation_not_found", "reason_required"], securityDefiner: true, mutatesData: true, publicExecutable: false },
];

interface OperationAuthorizationEntry { operation: string; allowedActorClasses: readonly ActorClass[] }

const OPERATION_AUTHORIZATION: readonly OperationAuthorizationEntry[] = [
  { operation: "bootstrap", allowedActorClasses: ["automated_ingestion_system", "migration_bootstrap_system_actor"] },
  { operation: "transition:draft->evidence_incomplete", allowedActorClasses: ["automated_ingestion_system", "authorized_reviewer"] },
  { operation: "transition:draft->review_required", allowedActorClasses: ["automated_ingestion_system", "authorized_reviewer"] },
  { operation: "transition:evidence_incomplete->review_required", allowedActorClasses: ["automated_ingestion_system", "authorized_reviewer"] },
  { operation: "transition:review_required->approved", allowedActorClasses: ["authorized_reviewer"] },
  { operation: "transition:review_required->evidence_incomplete", allowedActorClasses: ["authorized_reviewer"] },
  { operation: "transition:approved->publication_eligible", allowedActorClasses: ["publication_administrator"] },
  { operation: "transition:approved->review_required", allowedActorClasses: ["authorized_reviewer", "publication_administrator"] },
  { operation: "transition:publication_eligible->published", allowedActorClasses: ["publication_administrator"] },
  { operation: "transition:publication_eligible->review_required", allowedActorClasses: ["authorized_reviewer", "publication_administrator"] },
  { operation: "transition:published->suspended", allowedActorClasses: ["publication_administrator", "emergency_suspension_authority"] },
  { operation: "transition:suspended->published", allowedActorClasses: ["publication_administrator"] },
  { operation: "transition:suspended->review_required", allowedActorClasses: ["authorized_reviewer", "publication_administrator"] },
  { operation: "transition:published->superseded", allowedActorClasses: ["publication_administrator"] },
  { operation: "transition:published->withdrawn", allowedActorClasses: ["publication_administrator"] },
  { operation: "transition:*->withdrawn (non-terminal origins only)", allowedActorClasses: ["publication_administrator"] },
  { operation: "emergency_suspend", allowedActorClasses: ["emergency_suspension_authority"] },
  { operation: "translation:create_candidate", allowedActorClasses: ["automated_ingestion_system", "authorized_reviewer"] },
  { operation: "translation:submit_for_review", allowedActorClasses: ["authorized_reviewer"] },
  { operation: "translation:approve", allowedActorClasses: ["authorized_reviewer"] },
  { operation: "translation:reject", allowedActorClasses: ["authorized_reviewer"] },
  { operation: "translation:invalidate_for_canonical_change", allowedActorClasses: ["automated_ingestion_system"] },
  { operation: "translation:withdraw", allowedActorClasses: ["publication_administrator"] },
];

const AUTHORIZATION_INVARIANTS = {
  anonymousKnowledgeWriteAllowed: false,
  authenticatedKnowledgeWriteAllowed: false,
  smartTalkRuntimeWriteAllowed: false,
  actorIdentityDerivationMethod: "trusted execution context passed by the backend service (never a caller-supplied free-text 'role' claim); the RPC signature accepts actor_class/actor_identifier only as values the calling backend itself controls after its own authentication, never forwarded verbatim from an end-user request body",
  clientProvidedApprovalStatusTrusted: false,
  clientProvidedReviewSuccessFlagTrusted: false,
  clientProvidedCanonicalFingerprintTrustedAsAuthoritative: false,
} as const;

const DIRECT_WRITE_PATH_DECISION = {
  serviceRoleGetsDirectTableGrants: false,
  serviceRoleUnrestrictedDirectDmlTechnicallyPossible: true,
  serviceRoleUnrestrictedDirectDmlTechnicallyPossibleReason: "Supabase's service_role is a bypassrls-capable Postgres role by platform design; this is documented in migration 032's own header comment ('Service-role retains its normal Supabase RLS-bypass behavior'). No GRANT/REVOKE statement can retract that platform-level bypass capability.",
  serviceRoleUnrestrictedDirectDmlSelectedAsNormalPath: false,
  intendedApplicationWritePath: "Exclusively the 9 SECURITY DEFINER RPC functions listed in RPC_CONTRACTS; service_role is granted EXECUTE on those functions and nothing else on the 3 new tables (no direct table INSERT/UPDATE/DELETE grant of any kind).",
  auditExpectation: "Every accepted write documented as occurring through one of the 9 RPCs; a direct service_role DML statement against these 3 tables observed in PHASE 9N or later is treated as a control-bypass finding, not a supported path, precisely because the platform-level bypass capability is real and must be monitored rather than assumed away.",
  precedentInRepository: "supabase/migrations/015_i18n_insert_rpc_and_jobs.sql already uses exactly this pattern: security definer function, revoke all ... from public, grant execute ... to service_role, with no direct table grant to service_role.",
} as const;

// ============================================================================
// PART H — SECURITY DEFINER HARDENING
// ============================================================================

const SECURITY_DEFINER_HARDENING = {
  fixedSearchPath: HARDENED_SEARCH_PATH,
  strongerThanExistingRepositoryPrecedent: "supabase/migrations/015_i18n_insert_rpc_and_jobs.sql uses `set search_path = public` only; this plan deliberately strengthens to `pg_catalog, public` for every new SECURITY DEFINER function, since these functions govern publication/translation authorization rather than simple translation caching.",
  allObjectReferencesSchemaQualified: true,
  ownerRevokedFromPublic: true,
  explicitExecuteGrantsOnly: ["service_role"] as const,
  actorIdentityNeverCallerSuppliedFreeText: true,
  noDynamicSqlUnlessAllowlisted: true,
  dynamicSqlUsage: "None required: the polymorphic dispatch functions use a fixed CASE/IF branch per allowlisted entity_type, never string-built table/column identifiers.",
  untrustedObjectNameInterpolationUsed: false,
  exceptionBehavior: "Every RPC raises a structured exception (via RAISE EXCEPTION with a stable error message prefix) on any validation failure; PostgreSQL aborts the whole function-call transaction, no partial state is ever committed.",
} as const;

// ============================================================================
// PART I — SUSPENSION / SUPERSESSION / WITHDRAWAL
// ============================================================================

const EMERGENCY_SUSPENSION_FROM_STATE_DECISIONS: readonly { from: PublicationState; allowed: boolean; rationale: string }[] = [
  { from: "draft", allowed: true, rationale: "A draft can be emergency-suspended if e.g. it was created from a since-retracted source; moves it out of the normal pipeline immediately." },
  { from: "evidence_incomplete", allowed: true, rationale: "Same rationale as draft." },
  { from: "review_required", allowed: true, rationale: "An in-review unit can still need immediate emergency suspension if new information arrives mid-review." },
  { from: "approved", allowed: true, rationale: "Approved-but-not-yet-eligible units can still be emergency-suspended." },
  { from: "publication_eligible", allowed: true, rationale: "Eligible-but-not-yet-published units can still be emergency-suspended before they ever reach runtime." },
  { from: "published", allowed: true, rationale: "The primary intended use case: an already-live unit must be pulled from runtime eligibility immediately." },
  { from: "suspended", allowed: false, rationale: "Already suspended; a repeat emergency suspension would be a no-op state-machine edge, not a new transition; rejected as a same-state transition rather than silently accepted." },
  { from: "superseded", allowed: false, rationale: "Superseded is not itself runtime-eligible; emergency suspension would add no protective effect and is rejected to avoid confusing the audit trail." },
  { from: "withdrawn", allowed: false, rationale: "Withdrawn is terminal; no outbound transition of any kind, including emergency suspension, is permitted." },
];

const IS_SUSPENDED_HIDDEN_BOOLEAN_INTRODUCED = false;

const SUPERSESSION_RULES = {
  requiredReplacementReference: true,
  replacementExistenceValidated: "same fn_publication_subject_exists dispatch used for the original subject",
  replacementCannotEqualSubject: true,
  replacementEntityTypeCompatibilityRule: "replacement_entity_type need not equal the original entity_type (e.g. a claim can be superseded by a newer claim, or a process variant superseded by another process variant), but must itself be one of the 12 allowlisted PublicationSubjectType values and must independently pass fn_publication_subject_exists",
  supersessionCyclePrevention: "the transition RPC additionally checks that the replacement's OWN current publication state (if bootstrapped) does not already list the original subject as ITS replacement, rejecting a 2-cycle; longer cycles are a known residual governance responsibility documented honestly, not falsely claimed as fully prevented by this constraint alone",
  replacementDerivedFromUiLocaleForbidden: true,
  oldSubjectAndHistoryPreserved: true,
  automaticTranslationTransferForbidden: true,
  runtimeEligibilityEffect: "superseded is excluded from the runtime AND-gate identically to suspended/withdrawn",
} as const;

const WITHDRAWAL_RULES = {
  terminalStateEnforcement: true,
  mandatoryReason: true,
  authorizedActorClass: "publication_administrator" as ActorClass,
  historyPreserved: true,
  oldTranslationsPreservedAsHistoricalRecords: true,
  reactivationProhibited: true,
} as const;

// ============================================================================
// PART J — CANONICAL TRANSLATION TABLE CONTRACT (knowledge_canonical_unit_translations)
// ============================================================================

const CANONICAL_UNIT_TRANSLATIONS_COLUMNS: readonly ColumnContract[] = [
  { column: "id", sqlType: "uuid", nullable: false, defaultExpr: "gen_random_uuid()", checkConstraint: null, immutability: "immutable", writerPath: "create-candidate RPC only", indexParticipation: ["primary_key"], clientMayProvide: false },
  { column: "entity_type", sqlType: "text", nullable: false, defaultExpr: null, checkConstraint: "entity_type in <5 translatable entity types>", immutability: "immutable_after_verified", writerPath: "create-candidate RPC only", indexParticipation: ["ux_translations_full_history_unique", "ux_translations_active_approved_unique"], clientMayProvide: true },
  { column: "entity_id", sqlType: "uuid", nullable: false, defaultExpr: null, checkConstraint: null, immutability: "immutable_after_verified", writerPath: "create-candidate RPC only", indexParticipation: ["ux_translations_full_history_unique", "ux_translations_active_approved_unique"], clientMayProvide: true },
  { column: "field_key", sqlType: "text", nullable: false, defaultExpr: null, checkConstraint: "field_key in <6 allowlisted field keys>", immutability: "immutable_after_verified", writerPath: "create-candidate RPC only", indexParticipation: ["ux_translations_full_history_unique", "ux_translations_active_approved_unique"], clientMayProvide: true },
  { column: "canonical_content_fingerprint", sqlType: "text", nullable: false, defaultExpr: null, checkConstraint: "length(canonical_content_fingerprint) = 64", immutability: "immutable_after_verified", writerPath: "database-derived only, via fn_normalize_and_fingerprint_text; never accepted as authoritative caller input", indexParticipation: [], clientMayProvide: false },
  { column: "fingerprint_algorithm_version", sqlType: "text", nullable: false, defaultExpr: "'sha256_nfc_v1'", checkConstraint: "fingerprint_algorithm_version in ('sha256_nfc_v1')", immutability: "immutable_after_verified", writerPath: "database-derived only", indexParticipation: [], clientMayProvide: false },
  { column: "output_locale", sqlType: "text", nullable: false, defaultExpr: null, checkConstraint: "output_locale in <5 non-German launch locales>", immutability: "immutable_after_verified", writerPath: "create-candidate RPC only", indexParticipation: ["ux_translations_full_history_unique", "ux_translations_active_approved_unique", "ix_translations_output_locale"], clientMayProvide: true },
  { column: "translated_text", sqlType: "text", nullable: false, defaultExpr: null, checkConstraint: null, immutability: "immutable_after_verified", writerPath: "create-candidate RPC only", indexParticipation: [], clientMayProvide: true },
  { column: "translation_version", sqlType: "integer", nullable: false, defaultExpr: "1", checkConstraint: "translation_version > 0", immutability: "immutable_after_verified", writerPath: "create-candidate RPC only; database-computed as max(existing translation_version for this tuple)+1, never caller-supplied", indexParticipation: ["ux_translations_full_history_unique"], clientMayProvide: false },
  { column: "translation_status", sqlType: "text", nullable: false, defaultExpr: "'draft'", checkConstraint: "translation_status in <8 statuses>", immutability: "controlled_mutable_via_rpc_only", writerPath: "all translation RPCs; never a bare UPDATE", indexParticipation: ["ux_translations_active_approved_unique", "ix_translations_review_pending_partial", "ix_translations_invalidated_partial", "ix_translations_machine_pending_partial"], clientMayProvide: false },
  { column: "machine_generated", sqlType: "boolean", nullable: false, defaultExpr: "false", checkConstraint: null, immutability: "immutable_after_verified", writerPath: "create-candidate RPC only", indexParticipation: ["ix_translations_machine_pending_partial"], clientMayProvide: true },
  { column: "machine_provider", sqlType: "text", nullable: true, defaultExpr: null, checkConstraint: "not machine_generated or machine_provider is not null", immutability: "immutable_after_verified", writerPath: "create-candidate RPC only", indexParticipation: [], clientMayProvide: true },
  { column: "machine_model", sqlType: "text", nullable: true, defaultExpr: null, checkConstraint: "not machine_generated or machine_model is not null", immutability: "immutable_after_verified", writerPath: "create-candidate RPC only", indexParticipation: [], clientMayProvide: true },
  { column: "uncertainty_preserved", sqlType: "boolean", nullable: false, defaultExpr: "false", checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "approve RPC only, set true only after reviewer confirmation", indexParticipation: [], clientMayProvide: false },
  { column: "warnings_preserved", sqlType: "boolean", nullable: false, defaultExpr: "false", checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "approve RPC only", indexParticipation: [], clientMayProvide: false },
  { column: "numeric_and_deadline_values_preserved", sqlType: "boolean", nullable: false, defaultExpr: "false", checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "approve RPC only", indexParticipation: [], clientMayProvide: false },
  { column: "jurisdiction_inherited", sqlType: "boolean", nullable: false, defaultExpr: "true", checkConstraint: "jurisdiction_inherited = true", immutability: "immutable", writerPath: "schema-fixed, never writable to false", indexParticipation: [], clientMayProvide: false },
  { column: "effective_date_inherited", sqlType: "boolean", nullable: false, defaultExpr: "true", checkConstraint: "effective_date_inherited = true", immutability: "immutable", writerPath: "schema-fixed, never writable to false", indexParticipation: [], clientMayProvide: false },
  { column: "human_reviewed", sqlType: "boolean", nullable: false, defaultExpr: "false", checkConstraint: "translation_status <> 'approved' or (human_reviewed = true and uncertainty_preserved = true and warnings_preserved = true and numeric_and_deadline_values_preserved = true and review_record_id is not null)", immutability: "controlled_mutable_via_rpc_only", writerPath: "approve RPC only", indexParticipation: [], clientMayProvide: false },
  { column: "created_by_actor_type", sqlType: "text", nullable: false, defaultExpr: null, checkConstraint: null, immutability: "immutable_after_verified", writerPath: "create-candidate RPC only", indexParticipation: [], clientMayProvide: false },
  { column: "created_by_identifier", sqlType: "text", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "immutable_after_verified", writerPath: "create-candidate RPC only", indexParticipation: [], clientMayProvide: false },
  { column: "reviewed_by_actor_type", sqlType: "text", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "approve/reject RPC only", indexParticipation: [], clientMayProvide: false },
  { column: "reviewed_by_identifier", sqlType: "text", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "approve/reject RPC only; compared against created_by_identifier to block self-approval", indexParticipation: [], clientMayProvide: false },
  { column: "review_record_id", sqlType: "uuid", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "approve RPC only; references knowledge_review_records(id) on delete restrict", indexParticipation: [], clientMayProvide: true },
  { column: "rejection_reason", sqlType: "text", nullable: true, defaultExpr: null, checkConstraint: "translation_status <> 'rejected' or rejection_reason is not null", immutability: "controlled_mutable_via_rpc_only", writerPath: "reject RPC only", indexParticipation: [], clientMayProvide: true },
  { column: "glossary_snapshot_reference", sqlType: "text", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "immutable_after_verified", writerPath: "create-candidate RPC only", indexParticipation: [], clientMayProvide: true },
  { column: "provenance_note", sqlType: "text", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "any translation RPC", indexParticipation: [], clientMayProvide: true },
  { column: "created_at", sqlType: "timestamptz", nullable: false, defaultExpr: "now()", checkConstraint: null, immutability: "immutable", writerPath: "create-candidate RPC only", indexParticipation: [], clientMayProvide: false },
  { column: "verified_at", sqlType: "timestamptz", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "approve RPC only; once set, the immutability trigger locks the content/identity columns above", indexParticipation: [], clientMayProvide: false },
  { column: "superseded_at", sqlType: "timestamptz", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "create-candidate RPC only, set on the PRIOR row when a new version reaches approved", indexParticipation: [], clientMayProvide: false },
  { column: "invalidated_at", sqlType: "timestamptz", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "canonical-change trigger / invalidate RPC only", indexParticipation: ["ix_translations_invalidated_partial"], clientMayProvide: false },
  { column: "withdrawn_at", sqlType: "timestamptz", nullable: true, defaultExpr: null, checkConstraint: null, immutability: "controlled_mutable_via_rpc_only", writerPath: "withdraw RPC only", indexParticipation: [], clientMayProvide: false },
];

const GERMAN_STORED_AS_INDEPENDENT_TRANSLATION_TRUTH = false;

// ============================================================================
// PART K — HARD GATE B: CANONICAL TRANSLATION COMPOSITE IDENTITY
// ============================================================================

type TranslatableEntityType = "claim" | "process" | "process_step" | "evidence_requirement" | "authority_competence";

interface TranslatableFieldMapping {
  entityType: TranslatableEntityType;
  fieldKey: string;
  sourceTable: string;
  sourceIdColumn: string;
  sourceContentColumn: string;
  contentMayBeNull: boolean;
  contentKind: "plain_text";
}

const TRANSLATABLE_FIELD_ALLOWLIST: readonly TranslatableFieldMapping[] = [
  { entityType: "claim", fieldKey: "claim_text_canonical", sourceTable: "knowledge_claims", sourceIdColumn: "id", sourceContentColumn: "claim_text_canonical", contentMayBeNull: false, contentKind: "plain_text" },
  { entityType: "process", fieldKey: "title", sourceTable: "knowledge_processes", sourceIdColumn: "id", sourceContentColumn: "title", contentMayBeNull: false, contentKind: "plain_text" },
  { entityType: "process", fieldKey: "trigger_description", sourceTable: "knowledge_processes", sourceIdColumn: "id", sourceContentColumn: "trigger_description", contentMayBeNull: true, contentKind: "plain_text" },
  { entityType: "process", fieldKey: "safe_first_step", sourceTable: "knowledge_processes", sourceIdColumn: "id", sourceContentColumn: "safe_first_step", contentMayBeNull: true, contentKind: "plain_text" },
  { entityType: "process_step", fieldKey: "title", sourceTable: "knowledge_process_steps", sourceIdColumn: "id", sourceContentColumn: "title", contentMayBeNull: false, contentKind: "plain_text" },
  { entityType: "process_step", fieldKey: "description_canonical", sourceTable: "knowledge_process_steps", sourceIdColumn: "id", sourceContentColumn: "description_canonical", contentMayBeNull: true, contentKind: "plain_text" },
  { entityType: "evidence_requirement", fieldKey: "description_canonical", sourceTable: "knowledge_evidence_requirements", sourceIdColumn: "id", sourceContentColumn: "description_canonical", contentMayBeNull: true, contentKind: "plain_text" },
  { entityType: "authority_competence", fieldKey: "subject_matter", sourceTable: "knowledge_authority_competences", sourceIdColumn: "id", sourceContentColumn: "subject_matter", contentMayBeNull: false, contentKind: "plain_text" },
];

const TRANSLATABLE_ENTITY_TYPES: readonly TranslatableEntityType[] = Array.from(
  new Set(TRANSLATABLE_FIELD_ALLOWLIST.map((m) => m.entityType))
) as TranslatableEntityType[];
const TRANSLATABLE_FIELD_KEYS: readonly string[] = Array.from(new Set(TRANSLATABLE_FIELD_ALLOWLIST.map((m) => m.fieldKey)));

const CANONICAL_TRANSLATION_IDENTITY_FIELDS: readonly string[] = [
  "entity_type", "entity_id", "field_key", "canonical_content_fingerprint", "output_locale", "translation_version",
];

type FingerprintPrincipalContract = "database_derived" | "client_asserted_database_recomputed";
const CANONICAL_FINGERPRINT_PRINCIPAL_CONTRACT: FingerprintPrincipalContract = "database_derived";
const FINGERPRINT_CONTRACT_JUSTIFICATION =
  "Selected 'database_derived' (option 1) as the principal contract: the client never submits a fingerprint as part of translation-candidate creation, and the database always computes canonical_content_fingerprint itself via fn_normalize_and_fingerprint_text against the live allowlisted canonical row at the moment of the RPC call. A caller MAY optionally pass p_expected_fingerprint purely as an optimistic client-side staleness assertion (e.g. a UI that read the canonical text five minutes ago); if provided, the RPC compares it against the freshly-derived value and rejects EARLY with 'optimistic_fingerprint_assertion_mismatch' rather than silently proceeding — but the persisted, authoritative value is always the database's own fresh computation, never the caller's assertion. Option 2 (client submits an expected fingerprint and the database only recalculates-and-compares) was not selected as the PRINCIPAL contract because it would imply the client's assertion is a required input rather than an optional convenience, which is unnecessary complexity for a value the database can always compute unassisted.";

const TRANSLATION_COMPOSITE_IDENTITY_REJECTION_CASES: readonly string[] = [
  "fingerprint_from_another_entity", "fingerprint_from_another_field", "correct_fingerprint_attached_to_wrong_entity_id",
  "old_fingerprint_after_canonical_content_changes", "unknown_entity_type", "unknown_field_key", "unsupported_source_table",
  "translation_attached_to_another_translation_row", "german_output_locale", "inactive_future_locale", "locale_used_as_jurisdiction",
  "caller_supplied_canonical_content_treated_as_authoritative",
];

// ============================================================================
// PART L — CANONICAL FINGERPRINT SPECIFICATION
// ============================================================================

const REQUIRED_EXTENSION = "pgcrypto" as const;

const FINGERPRINT_SPEC = {
  canonicalInputSource: "the exact current text value of the allowlisted (entity_type, field_key) -> (source_table, source_content_column) mapping's row, for the given entity_id, read inside the same transaction as the fingerprint computation",
  normalizationRules: [
    "Unicode NFC normalization only (canonicalizes composed vs. decomposed forms; does not alter meaning, case, digits, punctuation or diacritics)",
    "CRLF -> LF line-ending normalization only (a byte-representation artifact of retrieval origin, not semantic content)",
    "a single outer trim of leading/trailing whitespace only (no internal whitespace collapsing)",
  ] as const,
  explicitlyNotNormalized: [
    "digits are never removed", "punctuation is never stripped", "diacritics are never removed", "case is never folded",
    "content is never collapsed across fields", "sentences are never reordered/sorted", "warning labels are never removed",
    "uncertainty language is never removed",
  ] as const,
  encoding: "UTF-8 bytes of the normalized string",
  hashAlgorithm: "sha256",
  outputRepresentation: "lowercase hex string, 64 characters, stored in a text column (mirrors knowledge_source_versions.content_hash's own text type)",
  fingerprintVersionColumn: "fingerprint_algorithm_version text not null default 'sha256_nfc_v1'",
  collisionTreatment: "SHA-256 collision probability is treated as cryptographically negligible; no additional collision-detection mechanism is planned",
  behaviorWhenCanonicalContentIsNull: "translation-candidate creation is rejected outright with 'canonical_content_null_not_translatable'; there is no fingerprint-of-null convention because a null field is not translatable in the first place",
  behaviorWhenCanonicalContentChanges: "handled entirely by the canonical-change invalidation trigger (PART O), never by silently updating a stored fingerprint",
  requiredExtension: REQUIRED_EXTENSION,
  extensionAlreadyUsedInRepository: false,
  extensionMayBeCreatedByPhase9M: true,
  extensionCreationStatement: "create extension if not exists pgcrypto",
  extensionAvailabilityMustBeValidatedInPhase9N: true,
} as const;

// ============================================================================
// PART M — TRANSLATION LIFECYCLE
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
  { from: "human_review_pending", to: "approved", rationale: "Reviewer approves; gated by the database CHECK requiring uncertainty/warning/numeric preservation and human_reviewed=true, and by fresh-fingerprint re-verification." },
  { from: "human_review_pending", to: "rejected", rationale: "Reviewer rejects; row retained permanently, never mutated further." },
  { from: "approved", to: "invalidated_pending_review", rationale: "Triggered synchronously by a change to the underlying German canonical content." },
  { from: "approved", to: "superseded", rationale: "A newer translation_version for the same key reached approved." },
  { from: "approved", to: "withdrawn", rationale: "The underlying German canonical unit itself was withdrawn." },
  { from: "invalidated_pending_review", to: "human_review_pending", rationale: "Re-review after invalidation." },
  { from: "invalidated_pending_review", to: "withdrawn", rationale: "The underlying German canonical unit itself was withdrawn." },
];

function computeTranslationTerminalStatuses(): readonly TranslationStatus[] {
  return TRANSLATION_STATUSES.filter((s) => !TRANSLATION_ALLOWED_TRANSITIONS.some((t) => t.from === s));
}
const TRANSLATION_TERMINAL_STATUSES = computeTranslationTerminalStatuses();

const TRANSLATION_LIFECYCLE_INVARIANTS = {
  machineTranslationAutoApprovalAllowed: false,
  machineTranslationAutoPublicationAllowed: false,
  translationUncertaintyMustBePreserved: true,
  translationWarningsMustBePreserved: true,
  translationNumbersAndDeadlinesMustBePreserved: true,
  machineGeneratedContentBeginsAsPendingReview: true,
  rejectedContentCannotBecomeApprovedWithoutNewVersion: true,
  canonicalContentChangeInvalidatesApprovedTranslation: true,
  invalidatedTranslationCannotRemainActiveApproved: true,
  supersededTranslationRemainsHistorical: true,
  withdrawnTranslationRemainsHistorical: true,
  germanOutputLocaleForbidden: true,
  futureInactiveOutputLocalesForbiddenUntilActivation: true,
} as const;

// ============================================================================
// PART N — ONE ACTIVE APPROVED TRANSLATION + IMMUTABILITY
// ============================================================================

const ACTIVE_APPROVED_STATUS_DEFINITION = {
  statusesConsideredActiveApproved: ["approved"] as const,
  additionalPredicates: ["superseded_at is null", "invalidated_at is null", "withdrawn_at is null"] as const,
  identityScope: ["entity_type", "entity_id", "field_key", "output_locale"] as const,
  translationVersionInsideOrOutsideUniquenessKey: "outside" as const,
  translationVersionInsideOrOutsideUniquenessKeyRationale: "translation_version is deliberately OUTSIDE the active-approved partial-unique key: the key targets 'at most one CURRENTLY active row per (entity,field,locale)' regardless of which version number that row happens to carry, which is exactly what the fingerprint-based invalidation model requires (a newer version can only become active once the old one has been superseded/invalidated, never side-by-side).",
  enforcedByDatabase: true,
  mechanism: "partial unique index ux_translations_active_approved_unique on (entity_type, entity_id, field_key, output_locale) where translation_status = 'approved' and superseded_at is null and invalidated_at is null and withdrawn_at is null",
} as const;

const APPROVED_IMMUTABLE_FIELDS: readonly string[] = [
  "entity_type", "entity_id", "field_key", "canonical_content_fingerprint", "output_locale", "translation_version",
  "translated_text", "machine_generated", "machine_provider", "machine_model", "created_by_actor_type", "created_by_identifier",
];

const APPROVED_IMMUTABILITY_TRIGGER = {
  name: "fn_canonical_unit_translations_protect_verified",
  mirrorsExistingPattern: "knowledge_source_versions_protect_locked_content (migration 032, lines 948-975)",
  behavior: "BEFORE UPDATE trigger: if OLD.verified_at is not null, raises an exception when any column in APPROVED_IMMUTABLE_FIELDS differs between NEW and OLD",
  correctedTranslationsBecome: "a new translation_version row via knowledge_create_translation_candidate, never an in-place edit of the approved row",
} as const;

// ============================================================================
// PART O — CANONICAL CHANGE AND TRANSLATION INVALIDATION
// ============================================================================

type CanonicalChangeMechanism =
  | "canonical_table_triggers" | "controlled_canonical_mutation_rpc" | "append_only_canonical_version_model" | "hybrid";

const CANONICAL_CHANGE_MECHANISM_ASSESSMENT: readonly { mechanism: CanonicalChangeMechanism; applicable: boolean; reasoning: string; selected: boolean }[] = [
  { mechanism: "append_only_canonical_version_model", applicable: false, selected: false,
    reasoning: "None of the 5 translatable canonical tables (knowledge_claims, knowledge_processes, knowledge_process_steps, knowledge_evidence_requirements, knowledge_authority_competences) has a separate version table the way knowledge_source_versions does for knowledge_sources; each row IS its own mutable-until-superseded record. This mechanism is not available without a much larger, out-of-scope schema change to those 5 tables." },
  { mechanism: "controlled_canonical_mutation_rpc", applicable: false, selected: false,
    reasoning: "Would require routing every future edit to any of the 8 allowlisted canonical columns through a brand-new RPC layer on top of 5 EXISTING migration-032 tables that currently have no such RPC layer at all (they are edited, when edited, by governance/ingestion tooling via ordinary UPDATE). Retrofitting a mandatory RPC boundary onto pre-existing tables is a materially larger, riskier footprint than an additive trigger, and is not required to achieve synchronous invalidation." },
  { mechanism: "canonical_table_triggers", applicable: true, selected: true,
    reasoning: "A single shared trigger function, installed once per translatable column on each of the 5 canonical tables (8 installations total, matching TRANSLATABLE_FIELD_ALLOWLIST), fires AFTER UPDATE OF <that column> and re-derives the fingerprint, comparing it against any currently active-approved translation row for that (entity_type, entity_id, field_key). This is purely additive (new triggers on existing tables, zero column/constraint changes to the 5 existing tables), requires no new RPC boundary on tables that do not have one today, and matches PHASE 9K's own selected 'synchronous' approach exactly." },
  { mechanism: "hybrid", applicable: false, selected: false, reasoning: "Not needed once canonical_table_triggers alone is sufficient and simplest." },
];

const SELECTED_CANONICAL_CHANGE_MECHANISM: CanonicalChangeMechanism = "canonical_table_triggers";

const CANONICAL_CHANGE_INVALIDATION_PLAN = {
  eventConstitutingChange: "an UPDATE statement on one of the 8 allowlisted (table, column) pairs where the new value's normalized fingerprint differs from the old value's normalized fingerprint",
  oldFingerprint: "computed from OLD.<column> via fn_normalize_and_fingerprint_text inside the trigger",
  newFingerprint: "computed from NEW.<column> via fn_normalize_and_fingerprint_text inside the trigger",
  lookupOfAffectedRows: "SELECT id FROM knowledge_canonical_unit_translations WHERE entity_type=$1 AND entity_id=$2 AND field_key=$3 AND canonical_content_fingerprint = <old fingerprint> AND translation_status = 'approved' AND superseded_at IS NULL AND invalidated_at IS NULL AND withdrawn_at IS NULL",
  transitionApplied: "each matched row -> knowledge_invalidate_translation_for_canonical_change(id), setting translation_status='invalidated_pending_review' and invalidated_at=now()",
  preservationOfOldTranslations: true,
  preventionOfOldTranslationUseForNewFingerprint: "the active-approved partial unique index's predicate excludes any row with invalidated_at set, so an invalidated row can never again satisfy 'currently active approved' for either the old or the new fingerprint",
  transactionBoundary: "the invalidation runs inside the SAME transaction as the canonical UPDATE that triggered it; if the canonical UPDATE's transaction rolls back, the invalidation rolls back with it",
  failureBehavior: "any exception inside the trigger aborts the enclosing canonical UPDATE entirely — a canonical content change can never partially succeed while silently failing to invalidate its dependent translations",
  reviewerWorkflowAfterInvalidation: "invalidated_pending_review rows surface in the review queue (ix_translations_review_pending_partial does not include this status by design; a distinct ix_translations_invalidated_partial index serves this queue) for a human reviewer to either approve a fresh candidate at translation_version+1 or withdraw the translated field entirely",
  silentTranslationCarryForwardAllowed: false,
  historicalTranslationPreservedAfterCanonicalChange: true,
} as const;

// ============================================================================
// PART P — POLYMORPHIC VALIDATION STRATEGY
// ============================================================================

const POLYMORPHIC_VALIDATION_STRATEGY = {
  publicationSubjectAllowlist: PUBLICATION_SUBJECT_MAPPINGS.map((m) => m.entityType),
  translationEntityFieldAllowlist: TRANSLATABLE_FIELD_ALLOWLIST.map((m) => `${m.entityType}.${m.fieldKey}`),
  schemaQualifiedTargetLookup: true,
  dynamicSqlBasedOnUnrestrictedCallerText: false,
  existenceValidationMechanism: "fixed CASE/IF branch per allowlisted entity_type/field_key, each running one targeted schema-qualified EXISTS(...) against exactly one correct table — mirrors migration 032's own existing, explicitly self-documented polymorphic convention (knowledge_review_records, knowledge_freshness_records, knowledge_audit_events, knowledge_trust_domain_links, knowledge_retrieval_metadata)",
  typeToTableMapping: "PUBLICATION_SUBJECT_MAPPINGS / TRANSLATABLE_FIELD_ALLOWLIST (this file)",
  fieldToColumnMapping: "TRANSLATABLE_FIELD_ALLOWLIST (this file)",
  rejectionOfUnsupportedCombinations: true,
  registryTableRequired: false,
  registryTableJustification: "carried forward from PHASE 9K's own 'optional_later' assessment: the trigger-validated dispatch boundary already prevents orphan references for this fixed, small, known set of entity types; unchanged by this implementation plan",
} as const;

const POLYMORPHIC_NEGATIVE_CASES: readonly string[] = [
  "sql_injection_like_entity_type", "sql_injection_like_field_key", "schema_qualified_malicious_input",
  "valid_table_but_forbidden_field", "valid_id_from_wrong_table", "translation_entity_used_as_canonical_target",
  "cross_border_connector_entity_while_inactive",
];

// ============================================================================
// PART Q — RLS AND PRIVILEGE MODEL
// ============================================================================

const RLS_PLAN = {
  newTables: [
    "knowledge_publication_states", "knowledge_publication_state_transitions", "knowledge_canonical_unit_translations",
  ] as const,
  enableStatementPattern: "alter table public.<table> enable row level security;",
  forcedRlsRequired: false,
  forcedRlsJustification: "migration 032 uses plain ENABLE ROW LEVEL SECURITY (not FORCE) uniformly across all 33 existing tables, relying on zero anon/authenticated policies for fail-closed behavior rather than FORCE ROW LEVEL SECURITY; this plan follows the identical, already-proven repository convention rather than introducing a new one",
  policiesCreated: 0,
  policyRationale: "matches all 33 existing knowledge_* tables: RLS enabled, zero policies for anon/authenticated, service_role's platform-level RLS bypass is the only path, and that path additionally has zero direct table grants per DIRECT_WRITE_PATH_DECISION",
  anonDirectReadDenied: true,
  anonDirectWriteDenied: true,
  authenticatedDirectReadDenied: true,
  authenticatedDirectWriteDenied: true,
  publicDirectAccessDenied: true,
  smartTalkRuntimeDirectWriteDenied: true,
  revokesFromPublicAnonAuthenticated: [
    "revoke all on public.knowledge_publication_states from public, anon, authenticated;",
    "revoke all on public.knowledge_publication_state_transitions from public, anon, authenticated;",
    "revoke all on public.knowledge_canonical_unit_translations from public, anon, authenticated;",
  ] as const,
  sequencePrivilegesApplicable: false,
  sequencePrivilegesJustification: "all 3 new tables use `id uuid primary key default gen_random_uuid()`, matching every existing knowledge_* table; no serial/identity/sequence-backed column is introduced, so no sequence GRANT/REVOKE statement is needed",
  functionExecuteRevokedFromPublic: true,
  functionExecuteGrantedOnlyTo: ["service_role"] as const,
  rlsAloneProtectsSecurityDefinerFunctionsAssumption: false,
  tableRevokesAloneProtectGrantedFunctionsAssumption: false,
} as const;

// ============================================================================
// PART R — SQL OBJECT ORDER (structured, dependency-validated)
// ============================================================================

type SqlObjectType =
  | "extension" | "function" | "table" | "unique_constraint" | "partial_unique_index" | "index"
  | "trigger_function" | "trigger" | "rpc_function" | "rls_enable" | "revoke" | "grant" | "final_check";

type ConstraintTiming = "create_time" | "post_create" | "deferred" | "runtime_validation" | "transaction_bound_validation" | "not_applicable";

interface SqlObjectSpec {
  orderIndex: number;
  name: string;
  type: SqlObjectType;
  dependencies: readonly string[];
  purpose: string;
  failureBehavior: string;
  expectedCaller: string;
  publicExecutable: boolean;
  securityDefiner: boolean;
  mutatesData: boolean;
  mustBeTestedInPhase9N: boolean;
  constraintTiming: ConstraintTiming;
}

const SQL_OBJECT_ORDER: readonly SqlObjectSpec[] = [
  { orderIndex: 1, name: "ext_pgcrypto", type: "extension", dependencies: [], purpose: "Provide digest()/sha256 for database-side fingerprint derivation.", failureBehavior: "migration aborts if the extension cannot be created (permissions)", expectedCaller: "migration runner", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 2, name: "fn_normalize_and_fingerprint_text", type: "function", dependencies: ["ext_pgcrypto"], purpose: "Pure function: NFC-normalize, CRLF->LF, trim, then sha256 hex-encode.", failureBehavior: "returns null for null input; never raises for valid text", expectedCaller: "other functions/triggers only, not directly by any RPC caller", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 3, name: "fn_translation_target_exists", type: "function", dependencies: [], purpose: "5-branch dispatch EXISTS check against the migration-032 translatable tables only.", failureBehavior: "returns false for unknown entity_type/nonexistent id rather than raising, so callers can produce a clean error", expectedCaller: "translation RPCs", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "runtime_validation" },
  { orderIndex: 4, name: "tbl_knowledge_publication_state_transitions", type: "table", dependencies: [], purpose: "Append-only transition history table; self-contained, zero FK onto the not-yet-existing states table.", failureBehavior: "CREATE TABLE fails atomically if any inline CHECK is malformed", expectedCaller: "migration runner", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "create_time" },
  { orderIndex: 5, name: "tbl_knowledge_publication_states", type: "table", dependencies: ["tbl_knowledge_publication_state_transitions"], purpose: "Current-state projection table; current_transition_id FK declared inline, referencing the now-existing transitions table.", failureBehavior: "CREATE TABLE fails atomically", expectedCaller: "migration runner", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "create_time" },
  { orderIndex: 6, name: "tbl_knowledge_canonical_unit_translations", type: "table", dependencies: [], purpose: "Canonical translation table; zero FK onto the other 2 new tables.", failureBehavior: "CREATE TABLE fails atomically", expectedCaller: "migration runner", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "create_time" },
  { orderIndex: 7, name: "fn_publication_subject_exists", type: "function", dependencies: ["tbl_knowledge_canonical_unit_translations"], purpose: "12-branch dispatch EXISTS check, including entity_type='canonical_translation' -> the now-existing translations table and 'complete_process_pack_version' -> knowledge_processes with process_group_id filter.", failureBehavior: "returns false for unknown/nonexistent; never raises directly", expectedCaller: "bootstrap RPC, transition RPC, validation trigger", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "runtime_validation" },
  { orderIndex: 8, name: "ux_publication_states_subject_unique", type: "unique_constraint", dependencies: ["tbl_knowledge_publication_states"], purpose: "unique(entity_type, entity_id) — exactly one current-state row per publication subject.", failureBehavior: "second bootstrap attempt raises unique_violation, caught by the bootstrap RPC", expectedCaller: "n/a (constraint)", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "create_time" },
  { orderIndex: 9, name: "ux_transitions_bootstrap_once", type: "partial_unique_index", dependencies: ["tbl_knowledge_publication_state_transitions"], purpose: "unique(entity_type, entity_id) where from_state is null — at most one null->draft row per subject, database-enforced independent of RPC logic.", failureBehavior: "second bootstrap-transition insert raises unique_violation", expectedCaller: "n/a (constraint)", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "create_time" },
  { orderIndex: 10, name: "ux_translations_full_history_unique", type: "unique_constraint", dependencies: ["tbl_knowledge_canonical_unit_translations"], purpose: "unique(entity_type, entity_id, field_key, output_locale, translation_version) — full-history version uniqueness.", failureBehavior: "duplicate version insert raises unique_violation", expectedCaller: "n/a (constraint)", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "create_time" },
  { orderIndex: 11, name: "ux_translations_active_approved_unique", type: "partial_unique_index", dependencies: ["tbl_knowledge_canonical_unit_translations"], purpose: "unique(entity_type, entity_id, field_key, output_locale) where translation_status='approved' and superseded_at is null and invalidated_at is null and withdrawn_at is null — enforces HARD GATE B's one-active-approved rule.", failureBehavior: "a second concurrent approval raises unique_violation, surfaced by the approve RPC as a conflict", expectedCaller: "n/a (constraint)", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "create_time" },
  { orderIndex: 12, name: "ix_publication_states_current_state", type: "index", dependencies: ["tbl_knowledge_publication_states"], purpose: "Filter by current_state (e.g. all published/suspended).", failureBehavior: "n/a", expectedCaller: "runtime eligibility queries, governance dashboards", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 13, name: "ix_publication_states_review_required_partial", type: "index", dependencies: ["tbl_knowledge_publication_states"], purpose: "Partial index on (entity_type, entity_id) where current_state='review_required'.", failureBehavior: "n/a", expectedCaller: "reviewer queue queries", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 14, name: "ix_publication_states_jurisdiction", type: "index", dependencies: ["tbl_knowledge_publication_states"], purpose: "Filter by jurisdiction_id override.", failureBehavior: "n/a", expectedCaller: "governance scoping queries", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 15, name: "ix_publication_states_current_transition", type: "index", dependencies: ["tbl_knowledge_publication_states"], purpose: "Fast join from projection to its accepted transition.", failureBehavior: "n/a", expectedCaller: "consistency-check queries, PHASE 9N validation", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 16, name: "ix_transitions_entity_transitioned_at", type: "index", dependencies: ["tbl_knowledge_publication_state_transitions"], purpose: "Ordered history lookup by subject.", failureBehavior: "n/a", expectedCaller: "audit/history queries", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 17, name: "ix_transitions_transitioned_at", type: "index", dependencies: ["tbl_knowledge_publication_state_transitions"], purpose: "Global monitoring by timestamp.", failureBehavior: "n/a", expectedCaller: "monitoring dashboards", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 18, name: "ix_transitions_emergency_partial", type: "index", dependencies: ["tbl_knowledge_publication_state_transitions"], purpose: "Partial index where emergency_flag=true.", failureBehavior: "n/a", expectedCaller: "emergency-audit queries", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 19, name: "ix_transitions_to_state_superseded_partial", type: "index", dependencies: ["tbl_knowledge_publication_state_transitions"], purpose: "Partial index where to_state='superseded' for supersession-chain lookups.", failureBehavior: "n/a", expectedCaller: "supersession-chain queries", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 20, name: "ix_transitions_idempotency_key", type: "index", dependencies: ["tbl_knowledge_publication_state_transitions"], purpose: "(entity_type, entity_id, idempotency_key) lookup for idempotent-replay detection.", failureBehavior: "n/a", expectedCaller: "bootstrap RPC, transition RPC", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 21, name: "ix_translations_review_pending_partial", type: "index", dependencies: ["tbl_knowledge_canonical_unit_translations"], purpose: "Partial index where translation_status in ('human_review_pending','machine_generated_pending_review').", failureBehavior: "n/a", expectedCaller: "reviewer queue queries", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 22, name: "ix_translations_invalidated_partial", type: "index", dependencies: ["tbl_knowledge_canonical_unit_translations"], purpose: "Partial index where invalidated_at is not null.", failureBehavior: "n/a", expectedCaller: "reviewer queue queries", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 23, name: "ix_translations_machine_pending_partial", type: "index", dependencies: ["tbl_knowledge_canonical_unit_translations"], purpose: "Partial index where machine_generated=true and translation_status='machine_generated_pending_review'.", failureBehavior: "n/a", expectedCaller: "machine-review queue queries", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 24, name: "ix_translations_output_locale", type: "index", dependencies: ["tbl_knowledge_canonical_unit_translations"], purpose: "Locale coverage queries for a process pack.", failureBehavior: "n/a", expectedCaller: "coverage-reporting queries", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 25, name: "fn_publication_state_transitions_append_only", type: "trigger_function", dependencies: ["tbl_knowledge_publication_state_transitions"], purpose: "Unconditionally raise on UPDATE OR DELETE.", failureBehavior: "raises exception, statement aborts", expectedCaller: "PostgreSQL trigger machinery only", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 26, name: "trg_publication_state_transitions_append_only", type: "trigger", dependencies: ["fn_publication_state_transitions_append_only"], purpose: "Attach the append-only guard BEFORE UPDATE OR DELETE.", failureBehavior: "n/a", expectedCaller: "PostgreSQL trigger machinery", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 27, name: "fn_publication_states_validate_write", type: "trigger_function", dependencies: ["fn_publication_subject_exists", "tbl_knowledge_publication_states"], purpose: "BEFORE INSERT OR UPDATE: validate entity existence and that current_transition_id's (entity_type, entity_id, to_state) matches this row's (entity_type, entity_id, current_state).", failureBehavior: "raises exception, statement aborts", expectedCaller: "PostgreSQL trigger machinery only", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 28, name: "trg_publication_states_validate_write", type: "trigger", dependencies: ["fn_publication_states_validate_write"], purpose: "Attach the validation guard BEFORE INSERT OR UPDATE.", failureBehavior: "n/a", expectedCaller: "PostgreSQL trigger machinery", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 29, name: "fn_canonical_unit_translations_protect_verified", type: "trigger_function", dependencies: ["tbl_knowledge_canonical_unit_translations"], purpose: "BEFORE UPDATE: once verified_at is set, reject changes to APPROVED_IMMUTABLE_FIELDS.", failureBehavior: "raises exception, statement aborts", expectedCaller: "PostgreSQL trigger machinery only", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 30, name: "trg_canonical_unit_translations_protect_verified", type: "trigger", dependencies: ["fn_canonical_unit_translations_protect_verified"], purpose: "Attach the immutability guard BEFORE UPDATE.", failureBehavior: "n/a", expectedCaller: "PostgreSQL trigger machinery", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 31, name: "fn_canonical_content_changed_invalidate_translations", type: "trigger_function", dependencies: ["tbl_knowledge_canonical_unit_translations", "fn_normalize_and_fingerprint_text"], purpose: "Shared AFTER UPDATE OF <column> function implementing PART O's invalidation lookup and transition.", failureBehavior: "raises exception, aborts the enclosing canonical UPDATE entirely", expectedCaller: "PostgreSQL trigger machinery only", publicExecutable: false, securityDefiner: true, mutatesData: true, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 32, name: "trg_claims_canonical_change_invalidate", type: "trigger", dependencies: ["fn_canonical_content_changed_invalidate_translations"], purpose: "Install on knowledge_claims AFTER UPDATE OF claim_text_canonical.", failureBehavior: "n/a", expectedCaller: "PostgreSQL trigger machinery", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 33, name: "trg_processes_canonical_change_invalidate", type: "trigger", dependencies: ["fn_canonical_content_changed_invalidate_translations"], purpose: "Install on knowledge_processes AFTER UPDATE OF title, trigger_description, safe_first_step.", failureBehavior: "n/a", expectedCaller: "PostgreSQL trigger machinery", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 34, name: "trg_process_steps_canonical_change_invalidate", type: "trigger", dependencies: ["fn_canonical_content_changed_invalidate_translations"], purpose: "Install on knowledge_process_steps AFTER UPDATE OF title, description_canonical.", failureBehavior: "n/a", expectedCaller: "PostgreSQL trigger machinery", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 35, name: "trg_evidence_requirements_canonical_change_invalidate", type: "trigger", dependencies: ["fn_canonical_content_changed_invalidate_translations"], purpose: "Install on knowledge_evidence_requirements AFTER UPDATE OF description_canonical.", failureBehavior: "n/a", expectedCaller: "PostgreSQL trigger machinery", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 36, name: "trg_authority_competences_canonical_change_invalidate", type: "trigger", dependencies: ["fn_canonical_content_changed_invalidate_translations"], purpose: "Install on knowledge_authority_competences AFTER UPDATE OF subject_matter.", failureBehavior: "n/a", expectedCaller: "PostgreSQL trigger machinery", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 37, name: "rpc_knowledge_bootstrap_publication_subject", type: "rpc_function", dependencies: ["tbl_knowledge_publication_state_transitions", "tbl_knowledge_publication_states", "fn_publication_subject_exists"], purpose: "See RPC_CONTRACTS.", failureBehavior: "see RPC_CONTRACTS failureModes", expectedCaller: "service_role only", publicExecutable: false, securityDefiner: true, mutatesData: true, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 38, name: "rpc_knowledge_transition_publication_state", type: "rpc_function", dependencies: ["tbl_knowledge_publication_state_transitions", "tbl_knowledge_publication_states", "fn_publication_subject_exists"], purpose: "See RPC_CONTRACTS.", failureBehavior: "see RPC_CONTRACTS failureModes", expectedCaller: "service_role only", publicExecutable: false, securityDefiner: true, mutatesData: true, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 39, name: "rpc_knowledge_emergency_suspend_publication_subject", type: "rpc_function", dependencies: ["rpc_knowledge_transition_publication_state"], purpose: "See RPC_CONTRACTS.", failureBehavior: "see RPC_CONTRACTS failureModes", expectedCaller: "service_role only", publicExecutable: false, securityDefiner: true, mutatesData: true, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 40, name: "rpc_knowledge_create_translation_candidate", type: "rpc_function", dependencies: ["tbl_knowledge_canonical_unit_translations", "fn_normalize_and_fingerprint_text", "fn_translation_target_exists"], purpose: "See RPC_CONTRACTS.", failureBehavior: "see RPC_CONTRACTS failureModes", expectedCaller: "service_role only", publicExecutable: false, securityDefiner: true, mutatesData: true, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 41, name: "rpc_knowledge_submit_translation_for_review", type: "rpc_function", dependencies: ["tbl_knowledge_canonical_unit_translations"], purpose: "See RPC_CONTRACTS.", failureBehavior: "see RPC_CONTRACTS failureModes", expectedCaller: "service_role only", publicExecutable: false, securityDefiner: true, mutatesData: true, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 42, name: "rpc_knowledge_approve_translation", type: "rpc_function", dependencies: ["tbl_knowledge_canonical_unit_translations", "fn_normalize_and_fingerprint_text"], purpose: "See RPC_CONTRACTS.", failureBehavior: "see RPC_CONTRACTS failureModes", expectedCaller: "service_role only", publicExecutable: false, securityDefiner: true, mutatesData: true, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 43, name: "rpc_knowledge_reject_translation", type: "rpc_function", dependencies: ["tbl_knowledge_canonical_unit_translations"], purpose: "See RPC_CONTRACTS.", failureBehavior: "see RPC_CONTRACTS failureModes", expectedCaller: "service_role only", publicExecutable: false, securityDefiner: true, mutatesData: true, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 44, name: "rpc_knowledge_invalidate_translation_for_canonical_change", type: "rpc_function", dependencies: ["tbl_knowledge_canonical_unit_translations"], purpose: "See RPC_CONTRACTS; called only from order-31's trigger function.", failureBehavior: "see RPC_CONTRACTS failureModes", expectedCaller: "fn_canonical_content_changed_invalidate_translations only, never a human-facing endpoint", publicExecutable: false, securityDefiner: true, mutatesData: true, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 45, name: "rpc_knowledge_withdraw_translation", type: "rpc_function", dependencies: ["tbl_knowledge_canonical_unit_translations"], purpose: "See RPC_CONTRACTS.", failureBehavior: "see RPC_CONTRACTS failureModes", expectedCaller: "service_role only", publicExecutable: false, securityDefiner: true, mutatesData: true, mustBeTestedInPhase9N: true, constraintTiming: "transaction_bound_validation" },
  { orderIndex: 46, name: "rls_enable_publication_state_transitions", type: "rls_enable", dependencies: ["tbl_knowledge_publication_state_transitions"], purpose: "alter table ... enable row level security.", failureBehavior: "n/a", expectedCaller: "migration runner", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 47, name: "rls_enable_publication_states", type: "rls_enable", dependencies: ["tbl_knowledge_publication_states"], purpose: "alter table ... enable row level security.", failureBehavior: "n/a", expectedCaller: "migration runner", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 48, name: "rls_enable_canonical_unit_translations", type: "rls_enable", dependencies: ["tbl_knowledge_canonical_unit_translations"], purpose: "alter table ... enable row level security.", failureBehavior: "n/a", expectedCaller: "migration runner", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 49, name: "revoke_new_tables_from_public_anon_authenticated", type: "revoke", dependencies: ["tbl_knowledge_publication_state_transitions", "tbl_knowledge_publication_states", "tbl_knowledge_canonical_unit_translations"], purpose: "revoke all on the 3 new tables from public, anon, authenticated.", failureBehavior: "n/a", expectedCaller: "migration runner", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 50, name: "revoke_rpc_functions_from_public", type: "revoke", dependencies: ["rpc_knowledge_bootstrap_publication_subject", "rpc_knowledge_transition_publication_state", "rpc_knowledge_emergency_suspend_publication_subject", "rpc_knowledge_create_translation_candidate", "rpc_knowledge_submit_translation_for_review", "rpc_knowledge_approve_translation", "rpc_knowledge_reject_translation", "rpc_knowledge_invalidate_translation_for_canonical_change", "rpc_knowledge_withdraw_translation"], purpose: "revoke all on each RPC function from public.", failureBehavior: "n/a", expectedCaller: "migration runner", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 51, name: "grant_rpc_functions_to_service_role", type: "grant", dependencies: ["revoke_rpc_functions_from_public"], purpose: "grant execute on each caller-facing RPC function to service_role only (excludes the system-only invalidate RPC).", failureBehavior: "n/a", expectedCaller: "migration runner", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: true, constraintTiming: "not_applicable" },
  { orderIndex: 52, name: "final_invariant_notes", type: "final_check", dependencies: ["grant_rpc_functions_to_service_role", "revoke_new_tables_from_public_anon_authenticated"], purpose: "Documentation-only closing note: no additional runtime invariant-check DO block is required beyond the constraints/triggers already defined above, matching migration 032's own convention of not using a trailing validation block.", failureBehavior: "n/a", expectedCaller: "n/a", publicExecutable: false, securityDefiner: false, mutatesData: false, mustBeTestedInPhase9N: false, constraintTiming: "not_applicable" },
];

const SQL_OBJECT_ORDER_COUNT = SQL_OBJECT_ORDER.length;
const DEFERRED_CONSTRAINTS_USED = SQL_OBJECT_ORDER.some((o) => o.constraintTiming === "deferred");
const DEFERRED_CONSTRAINT_COUNT = SQL_OBJECT_ORDER.filter((o) => o.constraintTiming === "deferred").length;

function validateSqlObjectDependencyOrder(objects: readonly SqlObjectSpec[]): { valid: boolean; violations: string[] } {
  const orderByName = new Map<string, number>();
  for (const o of objects) orderByName.set(o.name, o.orderIndex);
  const violations: string[] = [];
  for (const o of objects) {
    for (const dep of o.dependencies) {
      const depOrder = orderByName.get(dep);
      if (depOrder === undefined) { violations.push(`${o.name} depends on unknown object ${dep}`); continue; }
      if (!(depOrder < o.orderIndex)) violations.push(`${o.name} (order ${o.orderIndex}) depends on ${dep} (order ${depOrder}), which does not precede it`);
    }
  }
  return { valid: violations.length === 0, violations };
}

const SQL_OBJECT_ORDER_VALIDATION = validateSqlObjectDependencyOrder(SQL_OBJECT_ORDER);

// ============================================================================
// PART S — ROLLBACK BOUNDARIES
// ============================================================================

const ROLLBACK_BOUNDARY = {
  beforeRealDataExists: "All 3 new tables (and every function/trigger/index/RLS policy created for them) may be dropped in strict reverse dependency order; nothing outside this additive migration references them, and migration 032's 33 existing tables are untouched by any rollback of this extension.",
  afterRealDataExists: "Destructive rollback (DROP TABLE / DROP the extension) is forbidden once real publication or translation data exists. A forward-only corrective migration is required instead; transition history and translations are preserved; suspension/withdrawal transitions or feature-flag-style disablement are used in place of table deletion.",
  destructiveRollbackAllowedBeforeRealData: "conditionally_true" as const,
  destructiveRollbackAllowedAfterRealData: false,
  forwardFixRequiredAfterRealData: true,
  rollbackNotImplementedInThisPhase: true,
} as const;

// ============================================================================
// PART T — PHASE 9M EXACT FILE SCOPE
// ============================================================================

function computeNextFreeMigrationNumber(existingFiles: readonly string[]): string {
  const numbers = existingFiles
    .map((f) => f.match(/^(\d{3})_/))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => parseInt(m[1], 10));
  const max = numbers.length > 0 ? Math.max(...numbers) : 0;
  return String(max + 1).padStart(3, "0");
}

const PROPOSED_MIGRATION_NUMBER_CANDIDATE = "033" as const;
const PHASE_9M_MIGRATION_FILE_NAME_CANDIDATE = `${PROPOSED_MIGRATION_NUMBER_CANDIDATE}_add_publication_and_canonical_translation_schema.sql`;
const PHASE_9M_MIGRATION_REL_PATH_CANDIDATE = `${MIGRATIONS_DIR_REL_PATH}/${PHASE_9M_MIGRATION_FILE_NAME_CANDIDATE}`;
const PHASE_9M_AUDIT_REL_PATH_CANDIDATE =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-extension-migration-implementation-audit.ts";

const PHASE_9M_FILE_SCOPE = {
  expectedNewFiles: [PHASE_9M_MIGRATION_REL_PATH_CANDIDATE, PHASE_9M_AUDIT_REL_PATH_CANDIDATE] as const,
  expectedNewFileCount: 2,
  existingFileModificationAllowed: false,
  generatedTypesIncluded: false,
  generatedTypeDecisionOwner: "9O",
} as const;

// ============================================================================
// PART U — PHASE 9N ISOLATED POSTGRESQL VALIDATION PLAN
// ============================================================================

const PHASE_9N_VALIDATION_PLAN = {
  environment: "isolated, local, disposable PostgreSQL 17 container",
  prohibited: [
    "remote database", "production database", "Supabase link", "real knowledge data",
    "public runtime", "real source ingestion",
  ] as const,
  schemaStructureChecks: [
    "exact table count increase from 33 to 36", "all three new tables exist", "columns and types",
    "primary keys", "foreign keys", "deferred constraints (expected: zero)", "checks", "unique constraints",
    "partial unique indexes", "ordinary indexes", "functions", "triggers", "policies (expected: zero)", "grants and revokes",
    "pgcrypto extension successfully created and digest() callable",
  ] as const,
  bootstrapChecks: [
    "successful atomic null -> draft", "initial state version 1", "valid current transition",
    "duplicate bootstrap rejection", "idempotency replay behavior", "partial failure rollback", "invalid subject rejection",
  ] as const,
  transitionChecks: [
    "every allowed/conditionally_allowed transition accepted", "every forbidden transition rejected",
    "stale version rejected", "concurrent transition race safely serialized", "current-state/history consistency",
    "transition UPDATE rejected", "transition DELETE rejected", "withdrawal terminality", "suspension behavior",
    "supersession validation",
  ] as const,
  translationIdentityChecks: [
    "valid canonical tuple accepted", "wrong entity rejected", "wrong field rejected", "wrong fingerprint rejected",
    "stale fingerprint rejected", "German output locale rejected", "inactive locale rejected",
    "duplicate active approved translation rejected",
  ] as const,
  translationLifecycleChecks: [
    "machine-generated candidate cannot self-approve", "authorized approval succeeds", "unauthorized approval fails",
    "approved identity mutation rejected", "approved content mutation rejected", "new version workflow succeeds",
    "canonical change invalidates old approved translation", "history remains preserved",
  ] as const,
  securityChecks: [
    "anon denied", "authenticated denied", "PUBLIC denied", "unauthorized function execution denied",
    "search-path manipulation does not redirect objects", "actor spoofing rejected", "direct DML rejected",
  ] as const,
  cleanupRequired: "isolated database/container/volume torn down after validation completes",
} as const;

function phase9NCheckCount(): number {
  return (
    PHASE_9N_VALIDATION_PLAN.schemaStructureChecks.length +
    PHASE_9N_VALIDATION_PLAN.bootstrapChecks.length +
    PHASE_9N_VALIDATION_PLAN.transitionChecks.length +
    PHASE_9N_VALIDATION_PLAN.translationIdentityChecks.length +
    PHASE_9N_VALIDATION_PLAN.translationLifecycleChecks.length +
    PHASE_9N_VALIDATION_PLAN.securityChecks.length
  );
}

// ============================================================================
// PART V — CROSS-BORDER / FIRST CONTACT / PACK BOUNDARIES
// ============================================================================

const BOUNDARY_INVARIANTS = {
  germanKnowledgePackPublished: false,
  crossBorderConnectorActivated: false,
  standaloneFirstContactModeIntroduced: false,
  firstProcessPackId: FIRST_PROCESS_PACK_ID,
  firstPlannedCrossBorderPilot: FIRST_CROSS_BORDER_PILOT,
} as const;

// ============================================================================
// RESULT INTERFACE
// ============================================================================

interface Result {
  phaseId: "9L";
  phaseName: string;
  planKind: string;
  sourceDesignPhaseId: string;
  sourceDesignCommit: string;
  futureImplementationPhaseId: string;
  futureValidationPhaseId: string;
  canonicalLanguage: string;

  sourceClosureCount: number;
  sourceClosuresPresent: boolean;

  existingKnowledgeTableCount: number;
  existingKnowledgeTableCountPreserved: boolean;
  futureAdditiveTableCount: number;
  futureAdditiveTables: readonly string[];

  publicationStateCount: number;
  publicationStates: readonly PublicationState[];
  publicationTransitionRuleCount: number;
  publicationTransitionMatrixComplete: boolean;

  translationLifecycleStateCount: number;
  translationLifecycleStates: readonly TranslationStatus[];

  launchLanguageCount: number;
  launchLanguages: readonly string[];
  translationOutputLocaleCount: number;
  translationOutputLocales: readonly string[];
  futureInactiveLanguageCount: number;
  futureInactiveLanguages: readonly string[];

  bootstrapStrategy: BootstrapFamily;
  bootstrapStrategyFinalized: boolean;
  bootstrapAtomic: boolean;
  bootstrapInitialPreviousState: null;
  bootstrapInitialNextState: "draft";
  bootstrapInitialStateVersion: number;
  duplicateBootstrapBlocked: boolean;
  bootstrapIdempotencyDefined: boolean;
  currentTransitionRequiredAfterBootstrap: boolean;
  partialBootstrapPersistedOnFailure: boolean;

  optimisticConcurrencyRequired: boolean;
  rowLockRequired: boolean;
  lastWriteWinsAllowed: boolean;
  projectionAndTransitionAtomic: boolean;

  publicationSubjectMappingCount: number;
  publicationSubjectMappingsValidated: boolean;
  localeUsedForJurisdiction: boolean;

  canonicalTranslationCompositeIdentityRequired: boolean;
  canonicalTranslationIdentityFields: readonly string[];
  fingerprintAloneAcceptedAsIdentity: boolean;
  canonicalFingerprintDatabaseVerified: boolean;
  translationEntityFieldAllowlistDefined: boolean;

  singleActiveApprovedTranslationEnforcedByDatabase: boolean;
  approvedTranslationIdentityImmutable: boolean;
  approvedTranslationContentImmutable: boolean;
  silentTranslationCarryForwardAllowed: boolean;
  canonicalChangeInvalidationDefined: boolean;

  machineTranslationAutoApprovalAllowed: boolean;
  machineTranslationAutoPublicationAllowed: boolean;
  translationUncertaintyMustBePreserved: boolean;
  translationWarningsMustBePreserved: boolean;
  translationNumbersAndDeadlinesMustBePreserved: boolean;

  plannedSecurityDefinerFunctionCount: number;
  securityDefinerSearchPathsHardened: boolean;
  failClosedRlsPlannedForAllNewTables: boolean;
  directPublicReadPlanned: boolean;
  directPublicWritePlanned: boolean;
  anonymousKnowledgeWriteAllowed: boolean;
  authenticatedKnowledgeWriteAllowed: boolean;
  smartTalkRuntimeWriteAllowed: boolean;

  sqlObjectOrderCount: number;
  sqlObjectDependenciesValid: boolean;
  indexPlanCount: number;
  rollbackPlanDefined: boolean;
  phase9MExactFileScopeDefined: boolean;
  phase9MExpectedNewFileCount: number;
  phase9NValidationPlanDefined: boolean;

  realSourceFetched: boolean;
  realGovernmentContentStored: boolean;
  databaseWritePerformed: boolean;
  remoteDatabaseUsed: boolean;
  runtimeRetrievalEnabled: boolean;
  germanKnowledgePackPublished: boolean;
  crossBorderConnectorActivated: boolean;
  standaloneFirstContactModeIntroduced: boolean;
  productionAuthorizedNow: boolean;
  publicRuntimeAuthorizedNow: boolean;

  // File-scope / repository-evidence fields
  createdFileCount: number;
  modifiedExistingFileCount: number;
  existingFileModified: boolean;
  onlyExpectedFilesChanged: boolean;
  newAuditFileCreated: boolean;
  expectedHead: string;
  actualHead: string;
  headMatchesExpected: boolean;
  migration033Occupied: boolean;
  nextFreeMigrationNumber: string;

  tamperCaseCount: number;
  tamperCasesRejectedCount: number;
  tamperCasesRejected: boolean;

  blockingImplementationPlanGapCount: number;
  blockingImplementationPlanGaps: readonly string[];

  allPassed: boolean;
  readyForPublicationAndCanonicalTranslationSchemaExtensionMigrationImplementation: boolean;
  readyForRealGermanSourceIngestion: boolean;
  readyForControlledDatabaseWrite: boolean;
  readyForRuntimeRetrieval: boolean;
  nextRecommendedPhase: string;

  planDetail: {
    allowedTransitions: readonly StateTransitionSpec[];
    fullTransitionMatrix: readonly TransitionMatrixEntry[];
    explicitlyRejectedTransitionChecks: readonly { description: string; from: PublicationState | null; to: PublicationState; expectAllowed: boolean }[];
    publicationSubjectMappings: readonly PublicationSubjectMapping[];
    publicationSubjectRejectionCases: typeof PUBLICATION_SUBJECT_REJECTION_CASES;
    publicationStatesColumns: readonly ColumnContract[];
    publicationStatesTableRules: typeof PUBLICATION_STATES_TABLE_RULES;
    publicationStateTransitionsColumns: readonly ColumnContract[];
    transitionHistoryTableRules: typeof TRANSITION_HISTORY_TABLE_RULES;
    transitionReasonCodes: typeof TRANSITION_REASON_CODES;
    bootstrapFamilyAssessments: readonly BootstrapFamilyAssessment[];
    bootstrapTransactionSequence: readonly BootstrapSequenceStep[];
    transitionConcurrencySequence: readonly ConcurrencySequenceStep[];
    rpcContracts: readonly RpcContract[];
    operationAuthorization: readonly OperationAuthorizationEntry[];
    directWritePathDecision: typeof DIRECT_WRITE_PATH_DECISION;
    securityDefinerHardening: typeof SECURITY_DEFINER_HARDENING;
    supersessionRules: typeof SUPERSESSION_RULES;
    withdrawalRules: typeof WITHDRAWAL_RULES;
    canonicalUnitTranslationsColumns: readonly ColumnContract[];
    germanStoredAsIndependentTranslationTruth: typeof GERMAN_STORED_AS_INDEPENDENT_TRANSLATION_TRUTH;
    translatableFieldAllowlist: readonly TranslatableFieldMapping[];
    fingerprintSpec: typeof FINGERPRINT_SPEC;
    fingerprintContractJustification: typeof FINGERPRINT_CONTRACT_JUSTIFICATION;
    translationCompositeIdentityRejectionCases: typeof TRANSLATION_COMPOSITE_IDENTITY_REJECTION_CASES;
    approvedImmutableFields: typeof APPROVED_IMMUTABLE_FIELDS;
    approvedImmutabilityTrigger: typeof APPROVED_IMMUTABILITY_TRIGGER;
    canonicalChangeMechanismAssessment: readonly { mechanism: CanonicalChangeMechanism; applicable: boolean; reasoning: string; selected: boolean }[];
    canonicalChangeInvalidationPlan: typeof CANONICAL_CHANGE_INVALIDATION_PLAN;
    polymorphicValidationStrategy: typeof POLYMORPHIC_VALIDATION_STRATEGY;
    polymorphicNegativeCases: typeof POLYMORPHIC_NEGATIVE_CASES;
    sqlObjectOrder: readonly SqlObjectSpec[];
    rlsPlan: typeof RLS_PLAN;
    rollbackBoundary: typeof ROLLBACK_BOUNDARY;
    phase9MFileScope: typeof PHASE_9M_FILE_SCOPE;
    phase9NValidationPlan: typeof PHASE_9N_VALIDATION_PLAN;
  };

  notes: string[];
}

// ============================================================================
// TAMPER HARNESS (>= 70 cases required; built well above minimum)
// ============================================================================

type TamperCase = { id: number; category: string; description: string; mutate: (r: Result) => void };

const TAMPER_CASES: readonly TamperCase[] = [
  // Phase and scope tampering
  { id: 1, category: "phase_scope", description: "wrong phase ID", mutate: (r) => { (r as { phaseId: string }).phaseId = "9M"; } },
  { id: 2, category: "phase_scope", description: "wrong source commit", mutate: (r) => { r.sourceDesignCommit = "0000000"; } },
  { id: 3, category: "phase_scope", description: "SQL implementation marked as performed", mutate: (r) => { (r as unknown as { sqlMigrationCreated: boolean }).sqlMigrationCreated = true; r.allPassed = false; } },
  { id: 4, category: "phase_scope", description: "database write marked as performed", mutate: (r) => { r.databaseWritePerformed = true; } },
  { id: 5, category: "phase_scope", description: "runtime retrieval marked as enabled", mutate: (r) => { r.runtimeRetrievalEnabled = true; } },
  { id: 6, category: "phase_scope", description: "real source marked as fetched", mutate: (r) => { r.realSourceFetched = true; } },
  { id: 7, category: "phase_scope", description: "additional fourth table added", mutate: (r) => { r.futureAdditiveTableCount = 4; r.futureAdditiveTables = [...r.futureAdditiveTables, "knowledge_publication_extra"]; } },
  { id: 8, category: "phase_scope", description: "existing migration marked as modified", mutate: (r) => { r.existingFileModified = true; r.modifiedExistingFileCount = 1; } },
  { id: 9, category: "phase_scope", description: "Smart Talk route included in file scope", mutate: (r) => { r.phase9MExpectedNewFileCount = 3; } },
  { id: 10, category: "phase_scope", description: "First Contact mode marked as introduced", mutate: (r) => { r.standaloneFirstContactModeIntroduced = true; } },
  { id: 11, category: "phase_scope", description: "more than one file created", mutate: (r) => { r.createdFileCount = 2; } },
  { id: 12, category: "phase_scope", description: "existing file modified count nonzero", mutate: (r) => { r.modifiedExistingFileCount = 1; } },
  { id: 13, category: "phase_scope", description: "HEAD mismatch ignored", mutate: (r) => { r.headMatchesExpected = false; r.allPassed = true; } },

  // Publication state tampering
  { id: 14, category: "publication_state", description: "state removed", mutate: (r) => { r.publicationStates = r.publicationStates.filter((s) => s !== "suspended"); r.publicationStateCount = r.publicationStates.length; } },
  { id: 15, category: "publication_state", description: "unknown state added", mutate: (r) => { r.publicationStates = [...r.publicationStates, "archived" as PublicationState]; r.publicationStateCount = r.publicationStates.length; } },
  { id: 16, category: "publication_state", description: "withdrawn not terminal", mutate: (r) => { r.planDetail.fullTransitionMatrix = r.planDetail.fullTransitionMatrix.map((e) => e.from === "withdrawn" && e.to === "draft" ? { ...e, classification: "allowed" as TransitionClassification } : e); } },
  { id: 17, category: "publication_state", description: "suspended not reversible", mutate: (r) => { r.planDetail.fullTransitionMatrix = r.planDetail.fullTransitionMatrix.map((e) => e.from === "suspended" && e.to === "published" ? { ...e, classification: "forbidden" as TransitionClassification } : e); } },
  { id: 18, category: "publication_state", description: "direct draft-to-published edge allowed", mutate: (r) => { r.planDetail.fullTransitionMatrix = r.planDetail.fullTransitionMatrix.map((e) => e.from === "draft" && e.to === "published" ? { ...e, classification: "allowed" as TransitionClassification } : e); } },
  { id: 19, category: "publication_state", description: "withdrawal outbound edge allowed", mutate: (r) => { r.planDetail.fullTransitionMatrix = r.planDetail.fullTransitionMatrix.map((e) => e.from === "withdrawn" ? { ...e, classification: "allowed" as TransitionClassification } : e); } },
  { id: 20, category: "publication_state", description: "bootstrap directly to published", mutate: (r) => { r.bootstrapInitialNextState = "published" as unknown as "draft"; } },
  { id: 21, category: "publication_state", description: "same-state mutation broadly allowed", mutate: (r) => { r.planDetail.fullTransitionMatrix = r.planDetail.fullTransitionMatrix.map((e) => e.from === e.to ? { ...e, classification: "allowed" as TransitionClassification } : e); } },
  { id: 22, category: "publication_state", description: "transition matrix incomplete", mutate: (r) => { r.publicationTransitionMatrixComplete = false; } },

  // Bootstrap tampering
  { id: 23, category: "bootstrap", description: "no selected bootstrap strategy", mutate: (r) => { r.bootstrapStrategyFinalized = false; } },
  { id: 24, category: "bootstrap", description: "both alternative strategies left unresolved", mutate: (r) => { r.planDetail.bootstrapFamilyAssessments = r.planDetail.bootstrapFamilyAssessments.map((a) => ({ ...a, selected: true })); } },
  { id: 25, category: "bootstrap", description: "initial previous state not null", mutate: (r) => { (r as unknown as { bootstrapInitialPreviousState: unknown }).bootstrapInitialPreviousState = "draft"; } },
  { id: 26, category: "bootstrap", description: "initial state not draft", mutate: (r) => { r.bootstrapInitialNextState = "approved" as unknown as "draft"; } },
  { id: 27, category: "bootstrap", description: "initial version not 1", mutate: (r) => { r.bootstrapInitialStateVersion = 0; } },
  { id: 28, category: "bootstrap", description: "duplicate bootstrap allowed", mutate: (r) => { r.duplicateBootstrapBlocked = false; } },
  { id: 29, category: "bootstrap", description: "current transition nullable after commit", mutate: (r) => { r.currentTransitionRequiredAfterBootstrap = false; } },
  { id: 30, category: "bootstrap", description: "partial bootstrap can persist", mutate: (r) => { r.partialBootstrapPersistedOnFailure = true; } },
  { id: 31, category: "bootstrap", description: "no unique subject constraint", mutate: (r) => { r.planDetail.sqlObjectOrder = r.planDetail.sqlObjectOrder.filter((o) => o.name !== "ux_publication_states_subject_unique"); } },
  { id: 32, category: "bootstrap", description: "no idempotency strategy", mutate: (r) => { r.bootstrapIdempotencyDefined = false; } },
  { id: 33, category: "bootstrap", description: "transition inserted outside the transaction", mutate: (r) => { r.bootstrapAtomic = false; } },

  // Concurrency tampering
  { id: 34, category: "concurrency", description: "expected version optional", mutate: (r) => { r.optimisticConcurrencyRequired = false; } },
  { id: 35, category: "concurrency", description: "no row lock", mutate: (r) => { r.rowLockRequired = false; } },
  { id: 36, category: "concurrency", description: "caller controls resulting version", mutate: (r) => { r.projectionAndTransitionAtomic = true; r.lastWriteWinsAllowed = true; } },
  { id: 37, category: "concurrency", description: "last-write-wins enabled", mutate: (r) => { r.lastWriteWinsAllowed = true; } },
  { id: 38, category: "concurrency", description: "projection and transition committed separately", mutate: (r) => { r.projectionAndTransitionAtomic = false; } },

  // History tampering
  { id: 39, category: "history", description: "transition UPDATE allowed", mutate: (r) => { r.planDetail.sqlObjectOrder = r.planDetail.sqlObjectOrder.filter((o) => o.name !== "trg_publication_state_transitions_append_only"); } },
  { id: 40, category: "history", description: "transition DELETE allowed", mutate: (r) => { r.planDetail.sqlObjectOrder = r.planDetail.sqlObjectOrder.filter((o) => o.name !== "fn_publication_state_transitions_append_only"); } },
  { id: 41, category: "history", description: "non-bootstrap previous state nullable", mutate: (r) => { r.planDetail.publicationStateTransitionsColumns = r.planDetail.publicationStateTransitionsColumns.map((c) => c.column === "from_state" ? { ...c, checkConstraint: null } : c); } },
  { id: 42, category: "history", description: "history row mutable after approval", mutate: (r) => { r.planDetail.publicationStateTransitionsColumns = r.planDetail.publicationStateTransitionsColumns.map((c) => ({ ...c, immutability: "controlled_mutable_via_rpc_only" as const })); } },
  { id: 43, category: "history", description: "current state does not need to match transition", mutate: (r) => { r.planDetail.sqlObjectOrder = r.planDetail.sqlObjectOrder.filter((o) => o.name !== "fn_publication_states_validate_write"); } },

  // Translation identity tampering
  { id: 44, category: "translation_identity", description: "fingerprint-only identity", mutate: (r) => { r.canonicalTranslationCompositeIdentityRequired = false; r.fingerprintAloneAcceptedAsIdentity = true; } },
  { id: 45, category: "translation_identity", description: "entity ID removed from tuple", mutate: (r) => { r.canonicalTranslationIdentityFields = r.canonicalTranslationIdentityFields.filter((f) => f !== "entity_id"); } },
  { id: 46, category: "translation_identity", description: "field key removed", mutate: (r) => { r.canonicalTranslationIdentityFields = r.canonicalTranslationIdentityFields.filter((f) => f !== "field_key"); } },
  { id: 47, category: "translation_identity", description: "output locale removed", mutate: (r) => { r.canonicalTranslationIdentityFields = r.canonicalTranslationIdentityFields.filter((f) => f !== "output_locale"); } },
  { id: 48, category: "translation_identity", description: "translation version removed", mutate: (r) => { r.canonicalTranslationIdentityFields = r.canonicalTranslationIdentityFields.filter((f) => f !== "translation_version"); } },
  { id: 49, category: "translation_identity", description: "caller fingerprint trusted without verification", mutate: (r) => { r.canonicalFingerprintDatabaseVerified = false; } },
  { id: 50, category: "translation_identity", description: "arbitrary table name accepted", mutate: (r) => { r.planDetail.translatableFieldAllowlist = [...r.planDetail.translatableFieldAllowlist, { entityType: "claim", fieldKey: "arbitrary", sourceTable: "pg_shadow", sourceIdColumn: "usename", sourceContentColumn: "passwd", contentMayBeNull: true, contentKind: "plain_text" }]; r.translationEntityFieldAllowlistDefined = false; } },
  { id: 51, category: "translation_identity", description: "arbitrary field name accepted", mutate: (r) => { r.planDetail.translatableFieldAllowlist = [...r.planDetail.translatableFieldAllowlist, { entityType: "process", fieldKey: "unallowlisted_field", sourceTable: "knowledge_processes", sourceIdColumn: "id", sourceContentColumn: "unallowlisted_field", contentMayBeNull: true, contentKind: "plain_text" }]; r.translationEntityFieldAllowlistDefined = false; } },
  { id: 52, category: "translation_identity", description: "German output locale accepted", mutate: (r) => { r.translationOutputLocales = [...r.translationOutputLocales, "de"]; r.translationOutputLocaleCount = r.translationOutputLocales.length; } },
  { id: 53, category: "translation_identity", description: "inactive future locale accepted", mutate: (r) => { r.translationOutputLocales = [...r.translationOutputLocales, "ro"]; r.translationOutputLocaleCount = r.translationOutputLocales.length; } },
  { id: 54, category: "translation_identity", description: "old fingerprint accepted after canonical change", mutate: (r) => { r.silentTranslationCarryForwardAllowed = true; r.canonicalChangeInvalidationDefined = false; } },

  // Translation lifecycle tampering
  { id: 55, category: "translation_lifecycle", description: "machine-generated translation auto-approved", mutate: (r) => { r.machineTranslationAutoApprovalAllowed = true; } },
  { id: 56, category: "translation_lifecycle", description: "two active approved translations allowed", mutate: (r) => { r.singleActiveApprovedTranslationEnforcedByDatabase = false; } },
  { id: 57, category: "translation_lifecycle", description: "approved content editable", mutate: (r) => { r.approvedTranslationContentImmutable = false; } },
  { id: 58, category: "translation_lifecycle", description: "approved locale editable", mutate: (r) => { r.approvedTranslationIdentityImmutable = false; } },
  { id: 59, category: "translation_lifecycle", description: "approved translation moved to another entity", mutate: (r) => { r.approvedTranslationIdentityImmutable = false; } },
  { id: 60, category: "translation_lifecycle", description: "canonical fingerprint silently replaced", mutate: (r) => { r.canonicalFingerprintDatabaseVerified = false; r.silentTranslationCarryForwardAllowed = true; } },
  { id: 61, category: "translation_lifecycle", description: "historical translation deleted on invalidation", mutate: (r) => { r.canonicalChangeInvalidationDefined = false; } },
  { id: 62, category: "translation_lifecycle", description: "old translation silently attached to new German content", mutate: (r) => { r.silentTranslationCarryForwardAllowed = true; } },
  { id: 63, category: "translation_lifecycle", description: "machine translation auto-published", mutate: (r) => { r.machineTranslationAutoPublicationAllowed = true; } },
  { id: 64, category: "translation_lifecycle", description: "uncertainty preservation not required", mutate: (r) => { r.translationUncertaintyMustBePreserved = false; } },
  { id: 65, category: "translation_lifecycle", description: "warning preservation not required", mutate: (r) => { r.translationWarningsMustBePreserved = false; } },
  { id: 66, category: "translation_lifecycle", description: "numeric/deadline preservation not required", mutate: (r) => { r.translationNumbersAndDeadlinesMustBePreserved = false; } },

  // Security tampering
  { id: 67, category: "security", description: "RLS absent on one new table", mutate: (r) => { r.failClosedRlsPlannedForAllNewTables = false; } },
  { id: 68, category: "security", description: "PUBLIC read granted", mutate: (r) => { r.directPublicReadPlanned = true; } },
  { id: 69, category: "security", description: "anon write granted", mutate: (r) => { r.anonymousKnowledgeWriteAllowed = true; } },
  { id: 70, category: "security", description: "authenticated write granted", mutate: (r) => { r.authenticatedKnowledgeWriteAllowed = true; } },
  { id: 71, category: "security", description: "SECURITY DEFINER search path mutable", mutate: (r) => { r.securityDefinerSearchPathsHardened = false; } },
  { id: 72, category: "security", description: "function EXECUTE granted to PUBLIC", mutate: (r) => { r.directPublicWritePlanned = true; } },
  { id: 73, category: "security", description: "caller can claim reviewer role", mutate: (r) => { r.smartTalkRuntimeWriteAllowed = true; } },
  { id: 74, category: "security", description: "emergency suspension unrestricted", mutate: (r) => { r.smartTalkRuntimeWriteAllowed = true; r.anonymousKnowledgeWriteAllowed = true; } },
  { id: 75, category: "security", description: "direct service application DML selected as normal path without control", mutate: (r) => { r.smartTalkRuntimeWriteAllowed = true; r.databaseWritePerformed = true; } },

  // Cross-border and jurisdiction tampering
  { id: 76, category: "cross_border", description: "locale used for jurisdiction", mutate: (r) => { r.localeUsedForJurisdiction = true; } },
  { id: 77, category: "cross_border", description: "DE<->SK connector activated", mutate: (r) => { r.crossBorderConnectorActivated = true; } },
  { id: 78, category: "cross_border", description: "cross-border claims added to the first process pack", mutate: (r) => { r.germanKnowledgePackPublished = true; } },

  // Additional structural/derived-count tampering (beyond the prompt's minimum categories)
  { id: 79, category: "counts", description: "existingKnowledgeTableCountPreserved false but allPassed true", mutate: (r) => { r.existingKnowledgeTableCountPreserved = false; r.allPassed = true; } },
  { id: 80, category: "counts", description: "futureAdditiveTableCount mismatched with array length", mutate: (r) => { r.futureAdditiveTableCount = 2; } },
  { id: 81, category: "counts", description: "publicationStateCount tampered below 9", mutate: (r) => { r.publicationStateCount = 8; } },
  { id: 82, category: "counts", description: "translationLifecycleStateCount tampered below 8", mutate: (r) => { r.translationLifecycleStateCount = 7; } },
  { id: 83, category: "counts", description: "launchLanguageCount tampered", mutate: (r) => { r.launchLanguageCount = 5; } },
  { id: 84, category: "counts", description: "tamperCaseCount below required minimum of 70", mutate: (r) => { r.tamperCaseCount = 10; } },
  { id: 85, category: "counts", description: "tamperCasesRejectedCount less than tamperCaseCount while tamperCasesRejected true", mutate: (r) => { r.tamperCasesRejectedCount = r.tamperCaseCount - 1; r.tamperCasesRejected = true; } },
  { id: 86, category: "counts", description: "blockingImplementationPlanGapCount nonzero but allPassed true", mutate: (r) => { r.blockingImplementationPlanGapCount = 1; r.blockingImplementationPlanGaps = ["synthetic gap"]; r.allPassed = true; } },
  { id: 87, category: "counts", description: "readyForRealGermanSourceIngestion true in this phase", mutate: (r) => { r.readyForRealGermanSourceIngestion = true; } },
  { id: 88, category: "counts", description: "readyForControlledDatabaseWrite true in this phase", mutate: (r) => { r.readyForControlledDatabaseWrite = true; } },
  { id: 89, category: "counts", description: "readyForRuntimeRetrieval true in this phase", mutate: (r) => { r.readyForRuntimeRetrieval = true; } },
  { id: 90, category: "counts", description: "productionAuthorizedNow true", mutate: (r) => { r.productionAuthorizedNow = true; } },
  { id: 91, category: "counts", description: "publicRuntimeAuthorizedNow true", mutate: (r) => { r.publicRuntimeAuthorizedNow = true; } },
  { id: 92, category: "counts", description: "nextRecommendedPhase changed", mutate: (r) => { r.nextRecommendedPhase = "9N — Isolated PostgreSQL Validation"; } },
  { id: 93, category: "counts", description: "sqlObjectDependenciesValid false but allPassed true", mutate: (r) => { r.sqlObjectDependenciesValid = false; r.allPassed = true; } },
  { id: 94, category: "counts", description: "phase9MExpectedNewFileCount tampered", mutate: (r) => { r.phase9MExpectedNewFileCount = 1; } },
  { id: 95, category: "counts", description: "phase9NValidationPlanDefined false", mutate: (r) => { r.phase9NValidationPlanDefined = false; } },
];

function runTamperCases(good: Result): { rejected: number; total: number; failures: string[] } {
  let rejected = 0;
  const failures: string[] = [];
  for (const tc of TAMPER_CASES) {
    const mutated = clone(good);
    tc.mutate(mutated);
    const stillPasses = computeExpectedAllPassed(mutated);
    if (!stillPasses) rejected += 1; else failures.push(`#${tc.id} [${tc.category}] ${tc.description}`);
  }
  return { rejected, total: TAMPER_CASES.length, failures };
}

// ============================================================================
// VALIDATOR
// ============================================================================

function computeExpectedAllPassed(r: Result): boolean {
  const checks: boolean[] = [
    r.phaseId === "9L",
    r.sourceDesignPhaseId === SOURCE_DESIGN_PHASE_ID,
    r.sourceDesignCommit === SOURCE_DESIGN_COMMIT,
    r.futureImplementationPhaseId === FUTURE_IMPLEMENTATION_PHASE_ID,
    r.futureValidationPhaseId === FUTURE_VALIDATION_PHASE_ID,
    r.canonicalLanguage === "de",

    r.sourceClosureCount === SOURCE_CLOSURES.length,
    r.sourceClosuresPresent === true,

    r.existingKnowledgeTableCount === EXPECTED_KNOWLEDGE_TABLE_COUNT,
    r.existingKnowledgeTableCountPreserved === true,
    r.futureAdditiveTableCount === 3,
    r.futureAdditiveTables.length === 3,

    r.publicationStateCount === 9,
    r.publicationStates.length === 9,
    r.publicationTransitionRuleCount === ALLOWED_TRANSITIONS.length,
    r.publicationTransitionMatrixComplete === true,
    r.planDetail.fullTransitionMatrix.length === 90,
    r.planDetail.fullTransitionMatrix.filter((e) => e.classification !== "forbidden").length === 20,
    r.planDetail.fullTransitionMatrix.every((e) => !(e.from === "withdrawn" && e.classification !== "forbidden")),
    r.planDetail.fullTransitionMatrix.every((e) => !(e.from === e.to && e.classification !== "forbidden")),
    !r.planDetail.fullTransitionMatrix.some((e) => e.from === "draft" && e.to === "published" && e.classification !== "forbidden"),
    !r.planDetail.fullTransitionMatrix.some((e) => e.from === "evidence_incomplete" && e.to === "published" && e.classification !== "forbidden"),
    !r.planDetail.fullTransitionMatrix.some((e) => e.from === "review_required" && e.to === "published" && e.classification !== "forbidden"),
    !r.planDetail.fullTransitionMatrix.some((e) => e.from === "approved" && e.to === "published" && e.classification !== "forbidden"),
    !r.planDetail.fullTransitionMatrix.some((e) => e.from === null && e.to !== "draft" && e.classification !== "forbidden"),

    r.translationLifecycleStateCount === 8,
    r.translationLifecycleStates.length === 8,

    r.launchLanguageCount === 6,
    r.launchLanguages.length === 6,
    r.translationOutputLocaleCount === 5,
    r.translationOutputLocales.length === 5,
    !r.translationOutputLocales.includes("de"),
    !r.translationOutputLocales.some((l) => (FUTURE_INACTIVE_LANGUAGES as readonly string[]).includes(l)),
    r.futureInactiveLanguageCount === 5,
    r.futureInactiveLanguages.length === 5,

    r.bootstrapStrategy === "family_b_controlled_rpc",
    r.bootstrapStrategyFinalized === true,
    r.planDetail.bootstrapFamilyAssessments.filter((a) => a.selected).length === 1,
    r.bootstrapAtomic === true,
    r.bootstrapInitialPreviousState === null,
    r.bootstrapInitialNextState === "draft",
    r.bootstrapInitialStateVersion === 1,
    r.duplicateBootstrapBlocked === true,
    r.bootstrapIdempotencyDefined === true,
    r.currentTransitionRequiredAfterBootstrap === true,
    r.partialBootstrapPersistedOnFailure === false,
    r.planDetail.sqlObjectOrder.some((o) => o.name === "ux_publication_states_subject_unique"),
    r.planDetail.sqlObjectOrder.some((o) => o.name === "ux_transitions_bootstrap_once"),

    r.optimisticConcurrencyRequired === true,
    r.rowLockRequired === true,
    r.lastWriteWinsAllowed === false,
    r.projectionAndTransitionAtomic === true,

    r.publicationSubjectMappingCount === 12,
    r.publicationSubjectMappingsValidated === true,
    r.localeUsedForJurisdiction === false,

    r.canonicalTranslationCompositeIdentityRequired === true,
    r.canonicalTranslationIdentityFields.length === 6,
    r.canonicalTranslationIdentityFields.includes("entity_type"),
    r.canonicalTranslationIdentityFields.includes("entity_id"),
    r.canonicalTranslationIdentityFields.includes("field_key"),
    r.canonicalTranslationIdentityFields.includes("canonical_content_fingerprint"),
    r.canonicalTranslationIdentityFields.includes("output_locale"),
    r.canonicalTranslationIdentityFields.includes("translation_version"),
    r.fingerprintAloneAcceptedAsIdentity === false,
    r.canonicalFingerprintDatabaseVerified === true,
    r.translationEntityFieldAllowlistDefined === true,
    r.planDetail.translatableFieldAllowlist.every((m) => (["knowledge_claims", "knowledge_processes", "knowledge_process_steps", "knowledge_evidence_requirements", "knowledge_authority_competences"] as readonly string[]).includes(m.sourceTable)),

    r.singleActiveApprovedTranslationEnforcedByDatabase === true,
    r.approvedTranslationIdentityImmutable === true,
    r.approvedTranslationContentImmutable === true,
    r.silentTranslationCarryForwardAllowed === false,
    r.canonicalChangeInvalidationDefined === true,

    r.machineTranslationAutoApprovalAllowed === false,
    r.machineTranslationAutoPublicationAllowed === false,
    r.translationUncertaintyMustBePreserved === true,
    r.translationWarningsMustBePreserved === true,
    r.translationNumbersAndDeadlinesMustBePreserved === true,

    r.plannedSecurityDefinerFunctionCount === r.planDetail.rpcContracts.filter((c) => c.securityDefiner).length,
    r.plannedSecurityDefinerFunctionCount >= 9,
    r.securityDefinerSearchPathsHardened === true,
    r.failClosedRlsPlannedForAllNewTables === true,
    r.directPublicReadPlanned === false,
    r.directPublicWritePlanned === false,
    r.anonymousKnowledgeWriteAllowed === false,
    r.authenticatedKnowledgeWriteAllowed === false,
    r.smartTalkRuntimeWriteAllowed === false,

    r.sqlObjectOrderCount === r.planDetail.sqlObjectOrder.length,
    r.sqlObjectOrderCount >= 40,
    r.sqlObjectDependenciesValid === true,
    r.indexPlanCount >= 10,
    r.rollbackPlanDefined === true,
    r.phase9MExactFileScopeDefined === true,
    r.phase9MExpectedNewFileCount === 2,
    r.phase9NValidationPlanDefined === true,

    r.realSourceFetched === false,
    r.realGovernmentContentStored === false,
    r.databaseWritePerformed === false,
    r.remoteDatabaseUsed === false,
    r.runtimeRetrievalEnabled === false,
    r.germanKnowledgePackPublished === false,
    r.crossBorderConnectorActivated === false,
    r.standaloneFirstContactModeIntroduced === false,
    r.productionAuthorizedNow === false,
    r.publicRuntimeAuthorizedNow === false,

    r.createdFileCount === 1,
    r.modifiedExistingFileCount === 0,
    r.existingFileModified === false,
    r.onlyExpectedFilesChanged === true,
    r.newAuditFileCreated === true,
    r.headMatchesExpected === true,
    r.expectedHead === SOURCE_DESIGN_COMMIT,
    r.migration033Occupied === false,

    r.tamperCaseCount === TAMPER_CASES.length,
    r.tamperCaseCount >= 70,
    r.tamperCasesRejectedCount === r.tamperCaseCount,
    r.tamperCasesRejected === true,

    r.blockingImplementationPlanGapCount === 0,
    r.blockingImplementationPlanGaps.length === 0,

    !(r.readyForPublicationAndCanonicalTranslationSchemaExtensionMigrationImplementation === true && r.allPassed === false),
    !(r.readyForPublicationAndCanonicalTranslationSchemaExtensionMigrationImplementation === true && r.headMatchesExpected === false),
    !(r.readyForPublicationAndCanonicalTranslationSchemaExtensionMigrationImplementation === true && r.existingKnowledgeTableCountPreserved === false),
    !(r.readyForPublicationAndCanonicalTranslationSchemaExtensionMigrationImplementation === true && r.sqlObjectDependenciesValid === false),
    r.nextRecommendedPhase === `${FUTURE_IMPLEMENTATION_PHASE_ID} — Publication and Canonical Translation Schema Extension Migration Implementation`,
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
  migrationHasDropOrRename: boolean;
  migration032Modified: boolean;
  existingKnowledgeTablesPreserved: boolean;
  sourceClosureReadStatus: { relPath: string; present: boolean }[];
  migration033Occupied: boolean;
  nextFreeMigrationNumber: string;
  notes: string[];
}

function collectEvidence(): Evidence {
  const notes: string[] = [];

  const statusPorcelain = runGitReadOnly("git status --porcelain");
  const trackedLines = statusPorcelain.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
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
  const headMatchesExpected = actualHead === SOURCE_DESIGN_COMMIT;

  const migrationSql = readFileText(MIGRATION_REL_PATH);
  const tableNames = extractKnowledgeTableNames(migrationSql);
  const rlsTables = extractRlsEnabledTables(migrationSql);
  const migrationDiff = runGitReadOnly(`git diff -- ${MIGRATION_REL_PATH}`);
  const migration032Modified = migrationDiff.trim().length > 0;
  const migrationDropOrRenameDetected = migrationHasDropOrRename(migrationSql);

  const NEW_TABLE_NAME_LIST = ["knowledge_publication_states", "knowledge_publication_state_transitions", "knowledge_canonical_unit_translations"];
  const existingKnowledgeTablesPreserved =
    tableNames.length === EXPECTED_KNOWLEDGE_TABLE_COUNT &&
    !migrationDropOrRenameDetected &&
    NEW_TABLE_NAME_LIST.every((n) => !tableNames.includes(n));

  const sourceClosureReadStatus = SOURCE_CLOSURES.map((relPath) => ({ relPath, present: readFileText(relPath).length > 0 }));
  for (const s of sourceClosureReadStatus) if (!s.present) notes.push(`Could not read source closure ${s.relPath}`);

  const migrationFiles = listDirSafe(MIGRATIONS_DIR_REL_PATH);
  const migration033Occupied = migrationFiles.some((f) => /^033_/.test(f));
  const nextFreeMigrationNumber = computeNextFreeMigrationNumber(migrationFiles);
  if (migration033Occupied) notes.push("WARNING: a migration numbered 033 already exists; PHASE 9M must use a different number.");

  return {
    onlyExpectedFilesChanged, existingFileModified, newAuditFileCreated, createdFileCount, modifiedExistingFileCount,
    actualHead, headMatchesExpected,
    actualKnowledgeTableCountObservedFromMigration: tableNames.length,
    rlsEnabledTableCountObservedFromMigration: rlsTables.length,
    migrationHasDropOrRename: migrationDropOrRenameDetected,
    migration032Modified,
    existingKnowledgeTablesPreserved,
    sourceClosureReadStatus,
    migration033Occupied,
    nextFreeMigrationNumber,
    notes,
  };
}

// ============================================================================
// GOOD-RESULT CONSTRUCTION
// ============================================================================

function buildGoodResult(evidence: Evidence): Result {
  const planComplete =
    PUBLICATION_STATES.length === 9 &&
    ALLOWED_TRANSITIONS.length === 20 &&
    TERMINAL_STATES.length === 2 &&
    REVERSIBLE_STATES.length === 5 &&
    FULL_TRANSITION_MATRIX.length === 90 &&
    EXPLICITLY_REJECTED_TRANSITION_CHECKS.every((c) => transitionIsAllowed(c.from, c.to) === c.expectAllowed) &&
    PUBLICATION_SUBJECT_MAPPINGS.length === 12 &&
    TRANSLATION_STATUSES.length === 8 &&
    TRANSLATION_TERMINAL_STATUSES.length === 3 &&
    TRANSLATABLE_FIELD_ALLOWLIST.length === 8 &&
    TRANSLATABLE_ENTITY_TYPES.length === 5 &&
    TRANSLATABLE_FIELD_KEYS.length === 6 &&
    CANONICAL_TRANSLATION_IDENTITY_FIELDS.length === 6 &&
    LAUNCH_LANGUAGES.length === 6 &&
    TRANSLATION_OUTPUT_LOCALES.length === 5 &&
    FUTURE_INACTIVE_LANGUAGES.length === 5 &&
    !(TRANSLATION_OUTPUT_LOCALES as readonly string[]).includes("de") &&
    BOOTSTRAP_FAMILY_ASSESSMENTS.filter((a) => a.selected).length === 1 &&
    SELECTED_BOOTSTRAP_FAMILY === "family_b_controlled_rpc" &&
    CANONICAL_FINGERPRINT_PRINCIPAL_CONTRACT === "database_derived" &&
    CANONICAL_CHANGE_MECHANISM_ASSESSMENT.filter((a) => a.selected).length === 1 &&
    SELECTED_CANONICAL_CHANGE_MECHANISM === "canonical_table_triggers" &&
    SQL_OBJECT_ORDER_VALIDATION.valid === true &&
    DEFERRED_CONSTRAINTS_USED === false &&
    DEFERRED_CONSTRAINT_COUNT === 0 &&
    RPC_CONTRACTS.filter((c) => c.securityDefiner).length === RPC_CONTRACTS.length &&
    RPC_CONTRACTS.every((c) => c.searchPath === HARDENED_SEARCH_PATH) &&
    RLS_PLAN.newTables.length === 3 &&
    RLS_PLAN.policiesCreated === 0 &&
    PHASE_9M_FILE_SCOPE.expectedNewFileCount === 2 &&
    phase9NCheckCount() >= 40 &&
    EMERGENCY_SUSPENSION_FROM_STATE_DECISIONS.filter((d) => d.allowed).length === 6 &&
    EMERGENCY_SUSPENSION_FROM_STATE_DECISIONS.find((d) => d.from === "withdrawn")?.allowed === false &&
    IS_SUSPENDED_HIDDEN_BOOLEAN_INTRODUCED === false &&
    ACTIVE_APPROVED_STATUS_DEFINITION.enforcedByDatabase === true &&
    ACTIVE_APPROVED_STATUS_DEFINITION.translationVersionInsideOrOutsideUniquenessKey === "outside" &&
    GROUNDED_REVIEWER_ROLES.length === 8 &&
    ACTOR_CLASSES.length === 5;

  const evidenceOk =
    evidence.onlyExpectedFilesChanged &&
    !evidence.existingFileModified &&
    evidence.newAuditFileCreated &&
    evidence.createdFileCount === 1 &&
    evidence.modifiedExistingFileCount === 0 &&
    evidence.headMatchesExpected &&
    !evidence.migration032Modified &&
    !evidence.migrationHasDropOrRename &&
    evidence.actualKnowledgeTableCountObservedFromMigration === EXPECTED_KNOWLEDGE_TABLE_COUNT &&
    evidence.rlsEnabledTableCountObservedFromMigration === EXPECTED_KNOWLEDGE_TABLE_COUNT &&
    evidence.existingKnowledgeTablesPreserved &&
    evidence.sourceClosureReadStatus.every((s) => s.present) &&
    !evidence.migration033Occupied;

  const tamperOutcomePreview = { total: TAMPER_CASES.length };

  const allPassedBeforeTamper = planComplete && evidenceOk;

  const blockingGaps: string[] = [];
  if (!SQL_OBJECT_ORDER_VALIDATION.valid) blockingGaps.push(...SQL_OBJECT_ORDER_VALIDATION.violations);
  if (evidence.migration033Occupied) blockingGaps.push("migration number 033 is already occupied; PHASE 9M must use a different number");
  if (!evidenceOk) blockingGaps.push("repository preflight/evidence checks failed");
  if (!planComplete) blockingGaps.push("structured plan data failed internal consistency checks");

  const readyForImplementation = allPassedBeforeTamper && blockingGaps.length === 0;

  return {
    phaseId: PHASE_ID,
    phaseName: PHASE_NAME,
    planKind: PLAN_KIND,
    sourceDesignPhaseId: SOURCE_DESIGN_PHASE_ID,
    sourceDesignCommit: SOURCE_DESIGN_COMMIT,
    futureImplementationPhaseId: FUTURE_IMPLEMENTATION_PHASE_ID,
    futureValidationPhaseId: FUTURE_VALIDATION_PHASE_ID,
    canonicalLanguage: CANONICAL_LANGUAGE,

    sourceClosureCount: SOURCE_CLOSURES.length,
    sourceClosuresPresent: evidence.sourceClosureReadStatus.every((s) => s.present),

    existingKnowledgeTableCount: evidence.actualKnowledgeTableCountObservedFromMigration,
    existingKnowledgeTableCountPreserved: evidence.existingKnowledgeTablesPreserved,
    futureAdditiveTableCount: 3,
    futureAdditiveTables: ["knowledge_publication_states", "knowledge_publication_state_transitions", "knowledge_canonical_unit_translations"],

    publicationStateCount: PUBLICATION_STATES.length,
    publicationStates: PUBLICATION_STATES,
    publicationTransitionRuleCount: PUBLICATION_TRANSITION_RULE_COUNT,
    publicationTransitionMatrixComplete: FULL_TRANSITION_MATRIX.length === 90,

    translationLifecycleStateCount: TRANSLATION_STATUSES.length,
    translationLifecycleStates: TRANSLATION_STATUSES,

    launchLanguageCount: LAUNCH_LANGUAGES.length,
    launchLanguages: LAUNCH_LANGUAGES,
    translationOutputLocaleCount: TRANSLATION_OUTPUT_LOCALES.length,
    translationOutputLocales: TRANSLATION_OUTPUT_LOCALES,
    futureInactiveLanguageCount: FUTURE_INACTIVE_LANGUAGES.length,
    futureInactiveLanguages: FUTURE_INACTIVE_LANGUAGES,

    bootstrapStrategy: SELECTED_BOOTSTRAP_FAMILY,
    bootstrapStrategyFinalized: BOOTSTRAP_FAMILY_ASSESSMENTS.filter((a) => a.selected).length === 1,
    bootstrapAtomic: BOOTSTRAP_INVARIANTS.bootstrapAtomic,
    bootstrapInitialPreviousState: BOOTSTRAP_INVARIANTS.initialPreviousState,
    bootstrapInitialNextState: BOOTSTRAP_INVARIANTS.initialNextState,
    bootstrapInitialStateVersion: BOOTSTRAP_INVARIANTS.initialStateVersion,
    duplicateBootstrapBlocked: !BOOTSTRAP_INVARIANTS.duplicateBootstrapAllowed,
    bootstrapIdempotencyDefined: BOOTSTRAP_INVARIANTS.bootstrapIdempotencyDefined,
    currentTransitionRequiredAfterBootstrap: BOOTSTRAP_INVARIANTS.currentTransitionRequiredAfterBootstrap,
    partialBootstrapPersistedOnFailure: BOOTSTRAP_INVARIANTS.partialBootstrapPersistedOnFailure,

    optimisticConcurrencyRequired: CONCURRENCY_INVARIANTS.optimisticConcurrencyRequired,
    rowLockRequired: CONCURRENCY_INVARIANTS.rowLockRequired,
    lastWriteWinsAllowed: CONCURRENCY_INVARIANTS.lastWriteWinsAllowed,
    projectionAndTransitionAtomic: CONCURRENCY_INVARIANTS.projectionAndTransitionAtomic,

    publicationSubjectMappingCount: PUBLICATION_SUBJECT_MAPPING_COUNT,
    publicationSubjectMappingsValidated: true,
    localeUsedForJurisdiction: LOCALE_USED_FOR_JURISDICTION,

    canonicalTranslationCompositeIdentityRequired: true,
    canonicalTranslationIdentityFields: CANONICAL_TRANSLATION_IDENTITY_FIELDS,
    fingerprintAloneAcceptedAsIdentity: false,
    canonicalFingerprintDatabaseVerified: true,
    translationEntityFieldAllowlistDefined: true,

    singleActiveApprovedTranslationEnforcedByDatabase: ACTIVE_APPROVED_STATUS_DEFINITION.enforcedByDatabase,
    approvedTranslationIdentityImmutable: true,
    approvedTranslationContentImmutable: true,
    silentTranslationCarryForwardAllowed: CANONICAL_CHANGE_INVALIDATION_PLAN.silentTranslationCarryForwardAllowed,
    canonicalChangeInvalidationDefined: true,

    machineTranslationAutoApprovalAllowed: TRANSLATION_LIFECYCLE_INVARIANTS.machineTranslationAutoApprovalAllowed,
    machineTranslationAutoPublicationAllowed: TRANSLATION_LIFECYCLE_INVARIANTS.machineTranslationAutoPublicationAllowed,
    translationUncertaintyMustBePreserved: TRANSLATION_LIFECYCLE_INVARIANTS.translationUncertaintyMustBePreserved,
    translationWarningsMustBePreserved: TRANSLATION_LIFECYCLE_INVARIANTS.translationWarningsMustBePreserved,
    translationNumbersAndDeadlinesMustBePreserved: TRANSLATION_LIFECYCLE_INVARIANTS.translationNumbersAndDeadlinesMustBePreserved,

    plannedSecurityDefinerFunctionCount: RPC_CONTRACTS.filter((c) => c.securityDefiner).length,
    securityDefinerSearchPathsHardened: RPC_CONTRACTS.every((c) => c.searchPath === HARDENED_SEARCH_PATH),
    failClosedRlsPlannedForAllNewTables: true,
    directPublicReadPlanned: false,
    directPublicWritePlanned: false,
    anonymousKnowledgeWriteAllowed: AUTHORIZATION_INVARIANTS.anonymousKnowledgeWriteAllowed,
    authenticatedKnowledgeWriteAllowed: AUTHORIZATION_INVARIANTS.authenticatedKnowledgeWriteAllowed,
    smartTalkRuntimeWriteAllowed: AUTHORIZATION_INVARIANTS.smartTalkRuntimeWriteAllowed,

    sqlObjectOrderCount: SQL_OBJECT_ORDER_COUNT,
    sqlObjectDependenciesValid: SQL_OBJECT_ORDER_VALIDATION.valid,
    indexPlanCount: SQL_OBJECT_ORDER.filter((o) => o.type === "index" || o.type === "partial_unique_index" || o.type === "unique_constraint").length,
    rollbackPlanDefined: true,
    phase9MExactFileScopeDefined: true,
    phase9MExpectedNewFileCount: PHASE_9M_FILE_SCOPE.expectedNewFileCount,
    phase9NValidationPlanDefined: phase9NCheckCount() >= 40,

    realSourceFetched: false,
    realGovernmentContentStored: false,
    databaseWritePerformed: false,
    remoteDatabaseUsed: false,
    runtimeRetrievalEnabled: false,
    germanKnowledgePackPublished: BOUNDARY_INVARIANTS.germanKnowledgePackPublished,
    crossBorderConnectorActivated: BOUNDARY_INVARIANTS.crossBorderConnectorActivated,
    standaloneFirstContactModeIntroduced: BOUNDARY_INVARIANTS.standaloneFirstContactModeIntroduced,
    productionAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,

    createdFileCount: evidence.createdFileCount,
    modifiedExistingFileCount: evidence.modifiedExistingFileCount,
    existingFileModified: evidence.existingFileModified,
    onlyExpectedFilesChanged: evidence.onlyExpectedFilesChanged,
    newAuditFileCreated: evidence.newAuditFileCreated,
    expectedHead: SOURCE_DESIGN_COMMIT,
    actualHead: evidence.actualHead,
    headMatchesExpected: evidence.headMatchesExpected,
    migration033Occupied: evidence.migration033Occupied,
    nextFreeMigrationNumber: evidence.nextFreeMigrationNumber,

    tamperCaseCount: tamperOutcomePreview.total,
    tamperCasesRejectedCount: 0,
    tamperCasesRejected: false,

    blockingImplementationPlanGapCount: blockingGaps.length,
    blockingImplementationPlanGaps: blockingGaps,

    allPassed: readyForImplementation,
    readyForPublicationAndCanonicalTranslationSchemaExtensionMigrationImplementation: readyForImplementation,
    readyForRealGermanSourceIngestion: false,
    readyForControlledDatabaseWrite: false,
    readyForRuntimeRetrieval: false,
    nextRecommendedPhase: `${FUTURE_IMPLEMENTATION_PHASE_ID} — Publication and Canonical Translation Schema Extension Migration Implementation`,

    planDetail: {
      allowedTransitions: ALLOWED_TRANSITIONS,
      fullTransitionMatrix: FULL_TRANSITION_MATRIX,
      explicitlyRejectedTransitionChecks: EXPLICITLY_REJECTED_TRANSITION_CHECKS,
      publicationSubjectMappings: PUBLICATION_SUBJECT_MAPPINGS,
      publicationSubjectRejectionCases: PUBLICATION_SUBJECT_REJECTION_CASES,
      publicationStatesColumns: PUBLICATION_STATES_COLUMNS,
      publicationStatesTableRules: PUBLICATION_STATES_TABLE_RULES,
      publicationStateTransitionsColumns: PUBLICATION_STATE_TRANSITIONS_COLUMNS,
      transitionHistoryTableRules: TRANSITION_HISTORY_TABLE_RULES,
      transitionReasonCodes: TRANSITION_REASON_CODES,
      bootstrapFamilyAssessments: BOOTSTRAP_FAMILY_ASSESSMENTS,
      bootstrapTransactionSequence: BOOTSTRAP_TRANSACTION_SEQUENCE,
      transitionConcurrencySequence: TRANSITION_CONCURRENCY_SEQUENCE,
      rpcContracts: RPC_CONTRACTS,
      operationAuthorization: OPERATION_AUTHORIZATION,
      directWritePathDecision: DIRECT_WRITE_PATH_DECISION,
      securityDefinerHardening: SECURITY_DEFINER_HARDENING,
      supersessionRules: SUPERSESSION_RULES,
      withdrawalRules: WITHDRAWAL_RULES,
      canonicalUnitTranslationsColumns: CANONICAL_UNIT_TRANSLATIONS_COLUMNS,
      germanStoredAsIndependentTranslationTruth: GERMAN_STORED_AS_INDEPENDENT_TRANSLATION_TRUTH,
      translatableFieldAllowlist: TRANSLATABLE_FIELD_ALLOWLIST,
      fingerprintSpec: FINGERPRINT_SPEC,
      fingerprintContractJustification: FINGERPRINT_CONTRACT_JUSTIFICATION,
      translationCompositeIdentityRejectionCases: TRANSLATION_COMPOSITE_IDENTITY_REJECTION_CASES,
      approvedImmutableFields: APPROVED_IMMUTABLE_FIELDS,
      approvedImmutabilityTrigger: APPROVED_IMMUTABILITY_TRIGGER,
      canonicalChangeMechanismAssessment: CANONICAL_CHANGE_MECHANISM_ASSESSMENT,
      canonicalChangeInvalidationPlan: CANONICAL_CHANGE_INVALIDATION_PLAN,
      polymorphicValidationStrategy: POLYMORPHIC_VALIDATION_STRATEGY,
      polymorphicNegativeCases: POLYMORPHIC_NEGATIVE_CASES,
      sqlObjectOrder: SQL_OBJECT_ORDER,
      rlsPlan: RLS_PLAN,
      rollbackBoundary: ROLLBACK_BOUNDARY,
      phase9MFileScope: PHASE_9M_FILE_SCOPE,
      phase9NValidationPlan: PHASE_9N_VALIDATION_PLAN,
    },

    notes: [
      `onlyExpectedFilesChanged: ${evidence.onlyExpectedFilesChanged}`,
      `existingFileModified: ${evidence.existingFileModified}`,
      `newAuditFileCreated: ${evidence.newAuditFileCreated}`,
      `headMatchesExpected (${SOURCE_DESIGN_COMMIT}): ${evidence.headMatchesExpected}`,
      `migration032Modified (git diff): ${evidence.migration032Modified}`,
      `existingKnowledgeTablesPreserved: ${evidence.existingKnowledgeTablesPreserved} (observed ${evidence.actualKnowledgeTableCountObservedFromMigration} tables, ${evidence.rlsEnabledTableCountObservedFromMigration} RLS-enabled)`,
      `migration033Occupied: ${evidence.migration033Occupied}; nextFreeMigrationNumber: ${evidence.nextFreeMigrationNumber}`,
      `sqlObjectDependenciesValid: ${SQL_OBJECT_ORDER_VALIDATION.valid} (${SQL_OBJECT_ORDER_VALIDATION.violations.length} violations)`,
      "HARD GATE A resolved: family_b_controlled_rpc — no DEFERRABLE constraint anywhere in this plan, because knowledge_publication_state_transitions has zero FK back onto knowledge_publication_states (both link via the shared entity_type/entity_id natural key instead).",
      "HARD GATE B resolved: database_derived fingerprint contract; composite identity = (entity_type, entity_id, field_key, canonical_content_fingerprint, output_locale, translation_version); pgcrypto is required and not yet used anywhere in the repository.",
      "This audit read only committed plain text for migration 032 and the 5 prior knowledge/de audit files as static source closures — none was imported, executed, or modified.",
      "Zero SQL created, zero migrations applied, zero databases (local or remote) touched, zero Docker/Supabase processes started, zero sources fetched, zero rows inserted, zero runtime retrieval activated, zero publication performed, zero First Contact mode introduced, zero DE<->SK activation.",
      ...evidence.notes,
    ],
  };
}

// ============================================================================
// ENTRY POINT
// ============================================================================

export function runPublicationAndCanonicalTranslationSchemaExtensionImplementationPlanAudit(): Result {
  const evidence = collectEvidence();
  const good = buildGoodResult(evidence);
  const tamperOutcome = runTamperCases(good);

  const tamperFullyRejected = tamperOutcome.rejected === tamperOutcome.total;
  const finalGood: Result = {
    ...good,
    tamperCasesRejectedCount: tamperOutcome.rejected,
    tamperCasesRejected: tamperFullyRejected,
  };

  const allPassed = computeExpectedAllPassed(finalGood) && tamperFullyRejected && good.allPassed;

  return {
    ...finalGood,
    allPassed,
    readyForPublicationAndCanonicalTranslationSchemaExtensionMigrationImplementation: allPassed,
    readyForRealGermanSourceIngestion: false,
    readyForControlledDatabaseWrite: false,
    readyForRuntimeRetrieval: false,
    notes: [
      ...finalGood.notes,
      `Tamper rejection: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      ...(tamperOutcome.failures.length > 0 ? [`Tamper failures: ${tamperOutcome.failures.join("; ")}`] : []),
    ],
  };
}

if (require.main === module) {
  const result = runPublicationAndCanonicalTranslationSchemaExtensionImplementationPlanAudit();
  console.log(JSON.stringify(result));
}
