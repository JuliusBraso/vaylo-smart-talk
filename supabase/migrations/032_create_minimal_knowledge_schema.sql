-- PHASE 9G: Minimal German Knowledge System schema (Birello Smart Talk).
-- Additive, non-destructive, structural-only migration derived from PHASE 9A-9F.
-- Zero real or synthetic knowledge rows are inserted by this migration.
-- All 33 tables use the public.knowledge_* prefix (existing project convention,
-- see 010_knowledge_layer.sql). Checked against every pre-existing knowledge_*
-- table name (knowledge_topics, knowledge_steps, knowledge_step_dependencies) —
-- zero collisions; birello_knowledge_* fallback is not needed.
-- Fail-closed RLS: every table below has RLS enabled and zero anon/authenticated
-- policies. Service-role retains its normal Supabase RLS-bypass behavior; no
-- direct public read/write access is authorized by this migration.
-- This schema is fully disconnected from Smart Talk runtime, OCR, Vaylo DNA,
-- payments, and conversation history: no foreign key below references any
-- user-content table.

-- =============================================================================
-- GROUP 1 — FOUNDATION
-- =============================================================================

create table if not exists public.knowledge_trust_domains (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code in ('eu', 'de', 'sk', 'cz', 'pl', 'hu')),
  name text not null,
  active_from timestamptz,
  active_until timestamptz,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_jurisdictions (
  id uuid primary key default gen_random_uuid(),
  jurisdiction_level text not null check (jurisdiction_level in (
    'eu', 'de_federal', 'de_land', 'de_regierungsbezirk', 'de_kreis', 'de_kreisfreie_stadt',
    'de_stadt', 'de_gemeinde', 'de_bezirk', 'de_specific_authority',
    'cross_border_multi_jurisdiction', 'unresolved'
  )),
  jurisdiction_code text,
  country_code text,
  parent_jurisdiction_id uuid references public.knowledge_jurisdictions (id) on delete restrict,
  name text not null,
  valid_from timestamptz,
  valid_until timestamptz,
  status text not null default 'active' check (status in ('active', 'superseded', 'unresolved')),
  created_at timestamptz not null default now(),
  constraint knowledge_jurisdictions_valid_period check (valid_until is null or valid_from is null or valid_until >= valid_from)
);

create index if not exists knowledge_jurisdictions_parent_idx on public.knowledge_jurisdictions (parent_jurisdiction_id);
create index if not exists knowledge_jurisdictions_level_idx on public.knowledge_jurisdictions (jurisdiction_level);

-- Reusable territorial scope. Array code columns are bounded/app-validated;
-- authority_ids is a forward-referencing array (no FK) because knowledge_authorities
-- is created after this table — array columns cannot carry FK constraints in
-- PostgreSQL, so referential integrity there is an explicit application/governance
-- responsibility, not a false claim of full FK enforcement.
create table if not exists public.knowledge_territorial_scopes (
  id uuid primary key default gen_random_uuid(),
  scope_type text not null,
  jurisdiction_ids uuid[] not null default '{}',
  land_codes text[],
  kreis_codes text[],
  city_codes text[],
  municipality_codes text[],
  bezirk_codes text[],
  postal_code_areas text[],
  authority_ids uuid[] not null default '{}',
  service_area_ids text[],
  cross_border_countries text[],
  scope_verified boolean not null default false,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  valid_from timestamptz,
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  constraint knowledge_territorial_scopes_valid_period check (valid_until is null or valid_from is null or valid_until >= valid_from)
);

create index if not exists knowledge_territorial_scopes_type_idx on public.knowledge_territorial_scopes (scope_type);

-- Official status never implies universal subject/territorial/procedural competence.
create table if not exists public.knowledge_publishers (
  id uuid primary key default gen_random_uuid(),
  publisher_name text not null,
  publisher_type text not null,
  official_status boolean not null default false,
  subject_matter_competence text[] not null default '{}',
  territorial_competence_id uuid references public.knowledge_territorial_scopes (id) on delete restrict,
  procedural_competence text[],
  official_domain_ids text[],
  trust_domain_id uuid not null references public.knowledge_trust_domains (id) on delete restrict,
  active_from timestamptz,
  active_until timestamptz,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  created_at timestamptz not null default now(),
  constraint knowledge_publishers_active_period check (active_until is null or active_from is null or active_until >= active_from)
);

create index if not exists knowledge_publishers_territorial_competence_idx on public.knowledge_publishers (territorial_competence_id);
create index if not exists knowledge_publishers_trust_domain_idx on public.knowledge_publishers (trust_domain_id);

-- =============================================================================
-- GROUP 2 — SOURCE CORE (immutable history)
-- =============================================================================

create table if not exists public.knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  publisher_id uuid not null references public.knowledge_publishers (id) on delete restrict,
  source_type text not null,
  source_purpose text not null,
  canonical_url text,
  official_domain text,
  official_domain_verification_status text not null default 'unverified'
    check (official_domain_verification_status in ('verified', 'unverified', 'review_required')),
  jurisdiction_id uuid not null references public.knowledge_jurisdictions (id) on delete restrict,
  territorial_scope_id uuid references public.knowledge_territorial_scopes (id) on delete restrict,
  source_language text not null,
  publication_identifier text,
  supports_claim_types text[] not null default '{}',
  blocked_claim_types text[] not null default '{}',
  high_risk_use_allowed boolean not null default false,
  discovery_use_allowed boolean not null default true,
  status text not null default 'active' check (status in ('active', 'archived', 'superseded', 'unresolved')),
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create index if not exists knowledge_sources_publisher_idx on public.knowledge_sources (publisher_id);
create index if not exists knowledge_sources_jurisdiction_idx on public.knowledge_sources (jurisdiction_id);
create index if not exists knowledge_sources_territorial_scope_idx on public.knowledge_sources (territorial_scope_id);

-- Immutable source-version history. `locked_at` is set once a version becomes
-- accepted/superseded and is enforced by the trigger defined further below:
-- review workflow fields remain mutable, authoritative content identity does not.
create table if not exists public.knowledge_source_versions (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.knowledge_sources (id) on delete restrict,
  version_sequence integer not null check (version_sequence > 0),
  content_hash text not null,
  retrieved_at timestamptz not null default now(),
  published_at timestamptz,
  adopted_at timestamptz,
  promulgated_at timestamptz,
  effective_from timestamptz,
  effective_until timestamptz,
  applicable_from timestamptz,
  applicable_until timestamptz,
  source_last_modified_at timestamptz,
  supersedes_version_id uuid references public.knowledge_source_versions (id) on delete set null,
  superseded_by_version_id uuid references public.knowledge_source_versions (id) on delete set null,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  freshness_status text not null default 'unverified'
    check (freshness_status in ('fresh', 'aging', 'stale', 'expired', 'unverified', 'review_required')),
  change_status text not null default 'unverified'
    check (change_status in ('unchanged', 'updated', 'superseded', 'retracted', 'unverified')),
  immutable boolean not null default true check (immutable = true),
  historical_use_allowed boolean not null default true,
  current_use_allowed boolean not null default false,
  raw_content_location text,
  normalized_content_location text,
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  constraint knowledge_source_versions_seq_unique unique (source_id, version_sequence),
  constraint knowledge_source_versions_effective_period check (effective_until is null or effective_from is null or effective_until >= effective_from),
  constraint knowledge_source_versions_applicable_period check (applicable_until is null or applicable_from is null or applicable_until >= applicable_from),
  constraint knowledge_source_versions_no_self_supersede check (supersedes_version_id is null or supersedes_version_id <> id)
);

create index if not exists knowledge_source_versions_source_idx on public.knowledge_source_versions (source_id);
create index if not exists knowledge_source_versions_review_status_idx on public.knowledge_source_versions (review_status);
create index if not exists knowledge_source_versions_freshness_status_idx on public.knowledge_source_versions (freshness_status);
create index if not exists knowledge_source_versions_effective_from_idx on public.knowledge_source_versions (effective_from);
create index if not exists knowledge_source_versions_effective_until_idx on public.knowledge_source_versions (effective_until);

-- Passage-level citation granularity: precise claims must never cite a source
-- or source version alone (see knowledge_citations, knowledge_claim_evidence_links).
create table if not exists public.knowledge_source_passages (
  id uuid primary key default gen_random_uuid(),
  source_version_id uuid not null references public.knowledge_source_versions (id) on delete restrict,
  passage_order integer not null check (passage_order >= 0),
  heading_path text[],
  page_number integer,
  paragraph_number integer,
  section_identifier text,
  article_identifier text,
  text text not null,
  text_hash text not null,
  language text not null,
  character_start integer,
  character_end integer,
  citation_ready boolean not null default false,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  created_at timestamptz not null default now(),
  constraint knowledge_source_passages_order_unique unique (source_version_id, passage_order)
);

create index if not exists knowledge_source_passages_source_version_idx on public.knowledge_source_passages (source_version_id);

-- =============================================================================
-- GROUP 3 — AUTHORITY CORE
-- =============================================================================

create table if not exists public.knowledge_authorities (
  id uuid primary key default gen_random_uuid(),
  publisher_id uuid not null references public.knowledge_publishers (id) on delete restrict,
  authority_name text not null,
  authority_type text not null,
  jurisdiction_id uuid not null references public.knowledge_jurisdictions (id) on delete restrict,
  territorial_scope_id uuid not null references public.knowledge_territorial_scopes (id) on delete restrict,
  official_portal_url text,
  information_url text,
  application_url text,
  contact_channels text[],
  active_from timestamptz,
  active_until timestamptz,
  status text not null default 'active' check (status in ('active', 'reorganized', 'unresolved')),
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  created_at timestamptz not null default now()
);

create index if not exists knowledge_authorities_publisher_idx on public.knowledge_authorities (publisher_id);
create index if not exists knowledge_authorities_jurisdiction_idx on public.knowledge_authorities (jurisdiction_id);
create index if not exists knowledge_authorities_territorial_scope_idx on public.knowledge_authorities (territorial_scope_id);

-- Authority competence must never be inferred from free text or geographic
-- proximity alone: it is its own effective-dated, source-supported table.
create table if not exists public.knowledge_authority_competences (
  id uuid primary key default gen_random_uuid(),
  authority_id uuid not null references public.knowledge_authorities (id) on delete restrict,
  subject_matter text not null,
  territorial_scope_id uuid not null references public.knowledge_territorial_scopes (id) on delete restrict,
  personal_scope text,
  procedural_stage text,
  receives_application boolean not null default false,
  decides_application boolean not null default false,
  provides_information_only boolean not null default false,
  forwards_application boolean not null default false,
  issues_document boolean not null default false,
  verifies_evidence boolean not null default false,
  requests_foreign_evidence boolean not null default false,
  institution_exchange_expected boolean not null default false,
  handles_appeal boolean not null default false,
  handles_enforcement boolean not null default false,
  competence_source_version_id uuid not null references public.knowledge_source_versions (id) on delete restrict,
  competence_passage_id uuid references public.knowledge_source_passages (id) on delete restrict,
  effective_from timestamptz,
  effective_until timestamptz,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  conflict_status text not null default 'none' check (conflict_status in ('none', 'open', 'resolved', 'blocked')),
  created_at timestamptz not null default now(),
  constraint knowledge_authority_competences_effective_unique unique (authority_id, subject_matter, territorial_scope_id, effective_from),
  constraint knowledge_authority_competences_effective_period check (effective_until is null or effective_from is null or effective_until >= effective_from)
);

create index if not exists knowledge_authority_competences_authority_idx on public.knowledge_authority_competences (authority_id);
create index if not exists knowledge_authority_competences_territorial_scope_idx on public.knowledge_authority_competences (territorial_scope_id);
create index if not exists knowledge_authority_competences_source_version_idx on public.knowledge_authority_competences (competence_source_version_id);

-- =============================================================================
-- GROUP 4 — CLAIM CORE
-- =============================================================================

-- Claims are canonical German legal/procedural statements, separate from
-- source text and from any localized output. Localization never duplicates
-- legal truth (see knowledge_localized_terminology, which localizes terms only).
create table if not exists public.knowledge_claims (
  id uuid primary key default gen_random_uuid(),
  claim_type text not null,
  claim_text_canonical text not null,
  claim_language text not null default 'de' check (claim_language = 'de'),
  market text not null default 'DE' check (market = 'DE'),
  jurisdiction_id uuid not null references public.knowledge_jurisdictions (id) on delete restrict,
  territorial_scope_id uuid references public.knowledge_territorial_scopes (id) on delete restrict,
  authority_id uuid references public.knowledge_authorities (id) on delete restrict,
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'mixed')),
  allowed_output_uses text[] not null default '{}',
  blocked_output_uses text[] not null default '{}',
  requires_citation boolean not null default true check (requires_citation = true),
  requires_direct_support boolean not null default false,
  requires_effective_date boolean not null default false,
  requires_authority_resolution boolean not null default false,
  requires_conflict_clearance boolean not null default false,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  freshness_status text not null default 'unverified'
    check (freshness_status in ('fresh', 'aging', 'stale', 'expired', 'unverified', 'review_required')),
  effective_from timestamptz,
  effective_until timestamptz,
  status text not null default 'active' check (status in ('active', 'superseded', 'unresolved')),
  created_at timestamptz not null default now(),
  constraint knowledge_claims_effective_period check (effective_until is null or effective_from is null or effective_until >= effective_from)
);

create index if not exists knowledge_claims_jurisdiction_idx on public.knowledge_claims (jurisdiction_id);
create index if not exists knowledge_claims_territorial_scope_idx on public.knowledge_claims (territorial_scope_id);
create index if not exists knowledge_claims_authority_idx on public.knowledge_claims (authority_id);
create index if not exists knowledge_claims_claim_type_idx on public.knowledge_claims (claim_type);
create index if not exists knowledge_claims_risk_level_idx on public.knowledge_claims (risk_level);
create index if not exists knowledge_claims_review_status_idx on public.knowledge_claims (review_status);

-- A contradictory or no-support link is never authorized evidence merely
-- because the row exists: application/governance gates must read support_status,
-- review_accepted and conflict_status before treating a link as authorized.
create table if not exists public.knowledge_claim_evidence_links (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.knowledge_claims (id) on delete restrict,
  source_version_id uuid not null references public.knowledge_source_versions (id) on delete restrict,
  passage_id uuid not null references public.knowledge_source_passages (id) on delete restrict,
  support_status text not null check (support_status in (
    'direct_support', 'partial_support', 'contextual_support', 'contradictory', 'ambiguous', 'no_support'
  )),
  evidence_role text not null,
  is_primary_evidence boolean not null default false,
  jurisdiction_match boolean not null default false,
  territorial_scope_match boolean not null default false,
  authority_competence_match boolean not null default false,
  effective_date_match boolean not null default false,
  review_accepted boolean not null default false,
  conflict_status text not null default 'none' check (conflict_status in ('none', 'open', 'resolved', 'blocked')),
  qualification_required boolean not null default false,
  authorized_use text[] not null default '{}',
  created_at timestamptz not null default now(),
  constraint knowledge_claim_evidence_links_unique unique (claim_id, passage_id, evidence_role)
);

create index if not exists knowledge_claim_evidence_links_claim_idx on public.knowledge_claim_evidence_links (claim_id);
create index if not exists knowledge_claim_evidence_links_source_version_idx on public.knowledge_claim_evidence_links (source_version_id);
create index if not exists knowledge_claim_evidence_links_passage_idx on public.knowledge_claim_evidence_links (passage_id);
create index if not exists knowledge_claim_evidence_links_support_status_idx on public.knowledge_claim_evidence_links (support_status);

-- A citation must never rely on source_id alone for precise claims: source_version_id
-- and passage_id are both required and not nullable.
create table if not exists public.knowledge_citations (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.knowledge_claims (id) on delete restrict,
  source_id uuid not null references public.knowledge_sources (id) on delete restrict,
  source_version_id uuid not null references public.knowledge_source_versions (id) on delete restrict,
  passage_id uuid not null references public.knowledge_source_passages (id) on delete restrict,
  publisher_id uuid not null references public.knowledge_publishers (id) on delete restrict,
  jurisdiction_id uuid not null references public.knowledge_jurisdictions (id) on delete restrict,
  effective_from timestamptz,
  effective_until timestamptz,
  last_verified_at timestamptz,
  user_facing_label text not null,
  internal_audit_label text not null,
  original_language text not null,
  canonical_url text,
  created_at timestamptz not null default now()
);

create index if not exists knowledge_citations_claim_idx on public.knowledge_citations (claim_id);
create index if not exists knowledge_citations_source_idx on public.knowledge_citations (source_id);
create index if not exists knowledge_citations_source_version_idx on public.knowledge_citations (source_version_id);
create index if not exists knowledge_citations_passage_idx on public.knowledge_citations (passage_id);
create index if not exists knowledge_citations_publisher_idx on public.knowledge_citations (publisher_id);
create index if not exists knowledge_citations_jurisdiction_idx on public.knowledge_citations (jurisdiction_id);

-- =============================================================================
-- GROUP 5 — PROCESS CORE (created before/around rule-and-document core to keep
-- foreign-key dependencies acyclic: forms/deadline_rules/fee_rules are created
-- before process_steps so no nullable-bootstrap FK trick is required anywhere
-- in this migration).
-- =============================================================================

create table if not exists public.knowledge_responsible_actor_rules (
  id uuid primary key default gen_random_uuid(),
  actor_state text not null,
  user_must_act boolean not null default false,
  german_authority_must_act boolean not null default false,
  foreign_authority_must_act boolean not null default false,
  institution_exchange_expected boolean not null default false,
  professional_confirmation_required boolean not null default false,
  supporting_claim_ids uuid[] not null default '{}',
  supporting_passage_ids uuid[] not null default '{}',
  jurisdiction_id uuid references public.knowledge_jurisdictions (id) on delete restrict,
  territorial_scope_id uuid references public.knowledge_territorial_scopes (id) on delete restrict,
  effective_from timestamptz,
  effective_until timestamptz,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  conflict_status text not null default 'none' check (conflict_status in ('none', 'open', 'resolved', 'blocked')),
  concrete_instruction_allowed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists knowledge_responsible_actor_rules_jurisdiction_idx on public.knowledge_responsible_actor_rules (jurisdiction_id);
create index if not exists knowledge_responsible_actor_rules_territorial_scope_idx on public.knowledge_responsible_actor_rules (territorial_scope_id);

-- Supports all eight PHASE 9D process groups structurally; no rows are inserted.
create table if not exists public.knowledge_processes (
  id uuid primary key default gen_random_uuid(),
  process_group_id text not null check (process_group_id in (
    'anmeldung_ummeldung_abmeldung', 'steuer_id_and_basic_finanzamt_letters', 'health_insurance_orientation',
    'jobcenter_buergergeld', 'familienkasse_kindergeld', 'rechnung_mahnung', 'kuendigung_orientation',
    'auslaenderbehoerde_limited_orientation'
  )),
  title text not null,
  market text not null default 'DE' check (market = 'DE'),
  jurisdiction_id uuid not null references public.knowledge_jurisdictions (id) on delete restrict,
  territorial_scope_id uuid references public.knowledge_territorial_scopes (id) on delete restrict,
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'mixed')),
  orientation_only boolean not null default true check (orientation_only = true),
  trigger_description text,
  safe_first_step text,
  expected_outcomes text[],
  regional_variation_expected boolean not null default false,
  cross_border_preparation_relevant boolean not null default false,
  full_legal_advice_excluded boolean not null default true check (full_legal_advice_excluded = true),
  status text not null default 'active' check (status in ('active', 'unresolved')),
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  effective_from timestamptz,
  effective_until timestamptz,
  created_at timestamptz not null default now(),
  constraint knowledge_processes_effective_period check (effective_until is null or effective_from is null or effective_until >= effective_from)
);

create index if not exists knowledge_processes_group_idx on public.knowledge_processes (process_group_id);
create index if not exists knowledge_processes_jurisdiction_idx on public.knowledge_processes (jurisdiction_id);

-- =============================================================================
-- GROUP 6 — RULE AND DOCUMENT CORE
-- =============================================================================

-- A form alone never proves eligibility or entitlement; see knowledge_form_requirements
-- and knowledge_evidence_requirements for passage-level support of each field.
create table if not exists public.knowledge_forms (
  id uuid primary key default gen_random_uuid(),
  form_name text not null,
  form_identifier text,
  authority_id uuid not null references public.knowledge_authorities (id) on delete restrict,
  jurisdiction_id uuid not null references public.knowledge_jurisdictions (id) on delete restrict,
  territorial_scope_id uuid references public.knowledge_territorial_scopes (id) on delete restrict,
  source_version_id uuid not null references public.knowledge_source_versions (id) on delete restrict,
  instructions_passage_id uuid references public.knowledge_source_passages (id) on delete restrict,
  purpose text not null,
  submission_channels text[] not null default '{}',
  effective_from timestamptz,
  effective_until timestamptz,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  status text not null default 'active' check (status in ('active', 'superseded', 'unresolved')),
  created_at timestamptz not null default now()
);

create index if not exists knowledge_forms_authority_idx on public.knowledge_forms (authority_id);
create index if not exists knowledge_forms_jurisdiction_idx on public.knowledge_forms (jurisdiction_id);
create index if not exists knowledge_forms_source_version_idx on public.knowledge_forms (source_version_id);

-- Negative durations can never be stored; exact_calculation_allowed defaults
-- false (it is not globally allowed).
create table if not exists public.knowledge_deadline_rules (
  id uuid primary key default gen_random_uuid(),
  deadline_type text not null,
  trigger_event_type text not null,
  trigger_date_source text not null,
  duration_value integer check (duration_value is null or duration_value >= 0),
  duration_unit text,
  calendar_rule text,
  business_day_rule text,
  service_rule text,
  timezone_rule text,
  jurisdiction_id uuid not null references public.knowledge_jurisdictions (id) on delete restrict,
  territorial_scope_id uuid references public.knowledge_territorial_scopes (id) on delete restrict,
  authority_id uuid references public.knowledge_authorities (id) on delete restrict,
  source_version_id uuid not null references public.knowledge_source_versions (id) on delete restrict,
  passage_id uuid not null references public.knowledge_source_passages (id) on delete restrict,
  effective_from timestamptz,
  effective_until timestamptz,
  exact_calculation_allowed boolean not null default false,
  required_date_precision text not null default 'day',
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'mixed')),
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  conflict_status text not null default 'none' check (conflict_status in ('none', 'open', 'resolved', 'blocked')),
  created_at timestamptz not null default now()
);

create index if not exists knowledge_deadline_rules_jurisdiction_idx on public.knowledge_deadline_rules (jurisdiction_id);
create index if not exists knowledge_deadline_rules_authority_idx on public.knowledge_deadline_rules (authority_id);
create index if not exists knowledge_deadline_rules_source_version_idx on public.knowledge_deadline_rules (source_version_id);

create table if not exists public.knowledge_fee_rules (
  id uuid primary key default gen_random_uuid(),
  fee_status text not null check (fee_status in (
    'no_fee_expected', 'fee_possible', 'local_fee_possible', 'fee_stated_in_source',
    'fee_stated_in_document', 'fee_unknown', 'fee_conflict', 'fee_requires_verification'
  )),
  amount numeric,
  currency text,
  amount_type text,
  minimum_amount numeric,
  maximum_amount numeric,
  condition text,
  jurisdiction_id uuid not null references public.knowledge_jurisdictions (id) on delete restrict,
  territorial_scope_id uuid references public.knowledge_territorial_scopes (id) on delete restrict,
  authority_id uuid references public.knowledge_authorities (id) on delete restrict,
  source_version_id uuid not null references public.knowledge_source_versions (id) on delete restrict,
  passage_id uuid not null references public.knowledge_source_passages (id) on delete restrict,
  effective_from timestamptz,
  effective_until timestamptz,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  conflict_status text not null default 'none' check (conflict_status in ('none', 'open', 'resolved', 'blocked')),
  created_at timestamptz not null default now()
);

create index if not exists knowledge_fee_rules_jurisdiction_idx on public.knowledge_fee_rules (jurisdiction_id);
create index if not exists knowledge_fee_rules_authority_idx on public.knowledge_fee_rules (authority_id);
create index if not exists knowledge_fee_rules_source_version_idx on public.knowledge_fee_rules (source_version_id);

create table if not exists public.knowledge_process_steps (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references public.knowledge_processes (id) on delete restrict,
  step_order integer not null check (step_order >= 0),
  step_type text not null,
  title text not null,
  description_canonical text,
  responsible_actor_rule_id uuid not null references public.knowledge_responsible_actor_rules (id) on delete restrict,
  authority_id uuid references public.knowledge_authorities (id) on delete restrict,
  form_id uuid references public.knowledge_forms (id) on delete restrict,
  deadline_rule_id uuid references public.knowledge_deadline_rules (id) on delete restrict,
  fee_rule_id uuid references public.knowledge_fee_rules (id) on delete restrict,
  required_evidence_ids uuid[] not null default '{}',
  entry_conditions text[],
  exit_conditions text[],
  allowed_output_uses text[] not null default '{}',
  blocked_output_uses text[] not null default '{}',
  regional_variation_expected boolean not null default false,
  optional boolean not null default false,
  effective_from timestamptz,
  effective_until timestamptz,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  created_at timestamptz not null default now(),
  constraint knowledge_process_steps_order_unique unique (process_id, step_order)
);

create index if not exists knowledge_process_steps_process_idx on public.knowledge_process_steps (process_id);
create index if not exists knowledge_process_steps_responsible_actor_rule_idx on public.knowledge_process_steps (responsible_actor_rule_id);
create index if not exists knowledge_process_steps_form_idx on public.knowledge_process_steps (form_id);
create index if not exists knowledge_process_steps_deadline_rule_idx on public.knowledge_process_steps (deadline_rule_id);
create index if not exists knowledge_process_steps_fee_rule_idx on public.knowledge_process_steps (fee_rule_id);

-- An evidence requirement never assumes the user always acts: institution
-- exchange and authority-direct-request are tracked as distinct booleans.
create table if not exists public.knowledge_evidence_requirements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description_canonical text,
  required_by_process_id uuid references public.knowledge_processes (id) on delete restrict,
  required_by_step_id uuid references public.knowledge_process_steps (id) on delete restrict,
  responsible_actor_rule_id uuid not null references public.knowledge_responsible_actor_rules (id) on delete restrict,
  authority_requests_directly boolean not null default false,
  institution_exchange_expected boolean not null default false,
  user_submission_expected boolean not null default true,
  source_version_id uuid references public.knowledge_source_versions (id) on delete restrict,
  passage_id uuid references public.knowledge_source_passages (id) on delete restrict,
  jurisdiction_id uuid references public.knowledge_jurisdictions (id) on delete restrict,
  territorial_scope_id uuid references public.knowledge_territorial_scopes (id) on delete restrict,
  effective_from timestamptz,
  effective_until timestamptz,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  created_at timestamptz not null default now()
);

create index if not exists knowledge_evidence_requirements_process_idx on public.knowledge_evidence_requirements (required_by_process_id);
create index if not exists knowledge_evidence_requirements_step_idx on public.knowledge_evidence_requirements (required_by_step_id);
create index if not exists knowledge_evidence_requirements_responsible_actor_rule_idx on public.knowledge_evidence_requirements (responsible_actor_rule_id);

create table if not exists public.knowledge_form_requirements (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.knowledge_forms (id) on delete restrict,
  field_name text not null,
  field_type text not null,
  required_status text not null default 'required' check (required_status in ('required', 'conditional', 'optional')),
  condition text,
  evidence_requirement_id uuid references public.knowledge_evidence_requirements (id) on delete restrict,
  source_passage_id uuid not null references public.knowledge_source_passages (id) on delete restrict,
  effective_from timestamptz,
  effective_until timestamptz,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  created_at timestamptz not null default now(),
  constraint knowledge_form_requirements_field_unique unique (form_id, field_name)
);

create index if not exists knowledge_form_requirements_form_idx on public.knowledge_form_requirements (form_id);
create index if not exists knowledge_form_requirements_evidence_requirement_idx on public.knowledge_form_requirements (evidence_requirement_id);

-- Initial-pack eligibility rules must never authorize a final determination.
create table if not exists public.knowledge_eligibility_rules (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references public.knowledge_processes (id) on delete restrict,
  condition_expression text,
  required_facts text[] not null default '{}',
  jurisdiction_id uuid not null references public.knowledge_jurisdictions (id) on delete restrict,
  territorial_scope_id uuid references public.knowledge_territorial_scopes (id) on delete restrict,
  source_version_id uuid not null references public.knowledge_source_versions (id) on delete restrict,
  passage_id uuid not null references public.knowledge_source_passages (id) on delete restrict,
  effective_from timestamptz,
  effective_until timestamptz,
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'mixed')),
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  conflict_status text not null default 'none' check (conflict_status in ('none', 'open', 'resolved', 'blocked')),
  final_determination_allowed boolean not null default false check (final_determination_allowed = false),
  created_at timestamptz not null default now()
);

create index if not exists knowledge_eligibility_rules_process_idx on public.knowledge_eligibility_rules (process_id);
create index if not exists knowledge_eligibility_rules_jurisdiction_idx on public.knowledge_eligibility_rules (jurisdiction_id);

create table if not exists public.knowledge_process_claim_links (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references public.knowledge_processes (id) on delete restrict,
  process_step_id uuid references public.knowledge_process_steps (id) on delete restrict,
  claim_id uuid not null references public.knowledge_claims (id) on delete restrict,
  claim_role text not null,
  required boolean not null default false,
  sequence_context text,
  qualification_required boolean not null default false,
  created_at timestamptz not null default now(),
  constraint knowledge_process_claim_links_unique unique (process_id, process_step_id, claim_id, claim_role)
);

create index if not exists knowledge_process_claim_links_process_idx on public.knowledge_process_claim_links (process_id);
create index if not exists knowledge_process_claim_links_step_idx on public.knowledge_process_claim_links (process_step_id);
create index if not exists knowledge_process_claim_links_claim_idx on public.knowledge_process_claim_links (claim_id);

-- =============================================================================
-- GROUP 7 — GOVERNANCE CORE (append-oriented; no cascade deletes)
-- =============================================================================

-- base_rule_entity_id / override_rule_entity_id are bounded polymorphic
-- references: PostgreSQL cannot place an ordinary FK on a polymorphic column,
-- so entity *type* is constrained here and entity *id* integrity is an explicit
-- application/governance responsibility, not a false claim of full FK coverage.
create table if not exists public.knowledge_regional_overrides (
  id uuid primary key default gen_random_uuid(),
  base_rule_entity_type text not null check (base_rule_entity_type in (
    'claim', 'process', 'process_step', 'form', 'deadline_rule', 'fee_rule',
    'eligibility_rule', 'authority_competence', 'responsible_actor_rule'
  )),
  base_rule_entity_id uuid not null,
  override_rule_entity_type text not null check (override_rule_entity_type in (
    'claim', 'process', 'process_step', 'form', 'deadline_rule', 'fee_rule',
    'eligibility_rule', 'authority_competence', 'responsible_actor_rule'
  )),
  override_rule_entity_id uuid not null,
  override_type text not null,
  territorial_scope_id uuid not null references public.knowledge_territorial_scopes (id) on delete restrict,
  authority_id uuid references public.knowledge_authorities (id) on delete restrict,
  source_version_id uuid not null references public.knowledge_source_versions (id) on delete restrict,
  passage_id uuid references public.knowledge_source_passages (id) on delete restrict,
  priority_context text,
  effective_from timestamptz,
  effective_until timestamptz,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  conflict_status text not null default 'none' check (conflict_status in ('none', 'open', 'resolved', 'blocked')),
  substantive_law_changed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists knowledge_regional_overrides_territorial_scope_idx on public.knowledge_regional_overrides (territorial_scope_id);
create index if not exists knowledge_regional_overrides_authority_idx on public.knowledge_regional_overrides (authority_id);
create index if not exists knowledge_regional_overrides_base_entity_idx on public.knowledge_regional_overrides (base_rule_entity_type, base_rule_entity_id);

-- Review, freshness, conflict and audit history are append-oriented: no
-- cascade deletion is defined anywhere from these tables' foreign keys, and
-- superseding review records must be added rather than overwriting history.
create table if not exists public.knowledge_review_records (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in (
    'source', 'source_version', 'source_passage', 'publisher', 'jurisdiction', 'territorial_scope',
    'authority', 'authority_competence', 'claim', 'claim_evidence_link', 'process', 'process_step',
    'process_claim_link', 'form', 'form_requirement', 'evidence_requirement', 'deadline_rule', 'fee_rule',
    'eligibility_rule', 'regional_override', 'citation', 'terminology_entry', 'localized_terminology',
    'trust_domain', 'cross_border_connector', 'cross_border_process', 'responsible_actor_rule'
  )),
  entity_id uuid not null,
  review_status text not null
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  review_level text not null,
  reviewer_type text not null,
  reviewed_at timestamptz not null default now(),
  review_due_at timestamptz,
  reason text,
  notes text,
  source_change_detected boolean not null default false,
  high_risk_use_approved boolean not null default false,
  supersedes_review_record_id uuid references public.knowledge_review_records (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists knowledge_review_records_entity_idx on public.knowledge_review_records (entity_type, entity_id);
create index if not exists knowledge_review_records_review_status_idx on public.knowledge_review_records (review_status);

create table if not exists public.knowledge_freshness_records (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in (
    'source', 'source_version', 'source_passage', 'publisher', 'jurisdiction', 'territorial_scope',
    'authority', 'authority_competence', 'claim', 'claim_evidence_link', 'process', 'process_step',
    'process_claim_link', 'form', 'form_requirement', 'evidence_requirement', 'deadline_rule', 'fee_rule',
    'eligibility_rule', 'regional_override', 'citation', 'terminology_entry', 'localized_terminology',
    'trust_domain', 'cross_border_connector', 'cross_border_process', 'responsible_actor_rule'
  )),
  entity_id uuid not null,
  freshness_status text not null check (freshness_status in ('fresh', 'aging', 'stale', 'expired', 'unverified', 'review_required')),
  checked_at timestamptz not null default now(),
  next_check_due_at timestamptz,
  source_available boolean not null default true,
  content_hash_matches boolean not null default true,
  change_status text not null default 'unchanged' check (change_status in ('unchanged', 'updated', 'superseded', 'retracted', 'unverified')),
  effective_date_known boolean not null default false,
  review_required boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists knowledge_freshness_records_entity_idx on public.knowledge_freshness_records (entity_type, entity_id);
create index if not exists knowledge_freshness_records_status_idx on public.knowledge_freshness_records (freshness_status);

-- Conflict history is never deleted after resolution; unresolved high-risk-blocking
-- conflicts remain queryable via status/blocks_high_risk_use.
create table if not exists public.knowledge_conflicts (
  id uuid primary key default gen_random_uuid(),
  conflict_type text not null,
  entity_ids uuid[] not null default '{}',
  source_version_ids uuid[],
  passage_ids uuid[],
  jurisdiction_ids uuid[],
  authority_ids uuid[],
  detected_at timestamptz not null default now(),
  status text not null default 'open' check (status in ('open', 'resolved', 'blocked')),
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  blocks_high_risk_use boolean not null default true,
  resolution text,
  resolved_at timestamptz,
  review_record_id uuid references public.knowledge_review_records (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists knowledge_conflicts_status_idx on public.knowledge_conflicts (status);
create index if not exists knowledge_conflicts_review_record_idx on public.knowledge_conflicts (review_record_id);

-- Audit events never contain Smart Talk input or document content
-- (user_content_included is fixed false at the schema level).
create table if not exists public.knowledge_audit_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  entity_type text not null check (entity_type in (
    'source', 'source_version', 'source_passage', 'publisher', 'jurisdiction', 'territorial_scope',
    'authority', 'authority_competence', 'claim', 'claim_evidence_link', 'process', 'process_step',
    'process_claim_link', 'form', 'form_requirement', 'evidence_requirement', 'deadline_rule', 'fee_rule',
    'eligibility_rule', 'regional_override', 'citation', 'terminology_entry', 'localized_terminology',
    'trust_domain', 'cross_border_connector', 'cross_border_process', 'responsible_actor_rule'
  )),
  entity_id uuid not null,
  occurred_at timestamptz not null default now(),
  actor_type text not null,
  previous_state_hash text,
  new_state_hash text not null,
  reason text,
  source_commit text,
  review_record_id uuid references public.knowledge_review_records (id) on delete set null,
  user_content_included boolean not null default false check (user_content_included = false),
  created_at timestamptz not null default now()
);

create index if not exists knowledge_audit_events_entity_idx on public.knowledge_audit_events (entity_type, entity_id);
create index if not exists knowledge_audit_events_review_record_idx on public.knowledge_audit_events (review_record_id);

-- =============================================================================
-- GROUP 8 — LANGUAGE CORE
-- =============================================================================

create table if not exists public.knowledge_terminology (
  id uuid primary key default gen_random_uuid(),
  canonical_german_term text not null,
  definition_canonical text not null,
  jurisdiction_id uuid references public.knowledge_jurisdictions (id) on delete restrict,
  process_group_ids text[],
  source_version_id uuid not null references public.knowledge_source_versions (id) on delete restrict,
  passage_id uuid not null references public.knowledge_source_passages (id) on delete restrict,
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'mixed')),
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  effective_from timestamptz,
  effective_until timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists knowledge_terminology_jurisdiction_idx on public.knowledge_terminology (jurisdiction_id);
create index if not exists knowledge_terminology_source_version_idx on public.knowledge_terminology (source_version_id);

-- Localized terminology never duplicates whole legal claims by locale, and
-- the official German term is always retained alongside the localized term.
create table if not exists public.knowledge_localized_terminology (
  id uuid primary key default gen_random_uuid(),
  terminology_entry_id uuid not null references public.knowledge_terminology (id) on delete restrict,
  output_locale text not null check (output_locale in ('de', 'en', 'sk', 'cs', 'pl', 'hu')),
  localized_term text not null,
  localized_explanation text not null,
  translation_status text not null default 'draft',
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  reviewed_by text,
  official_german_term_retained boolean not null default true check (official_german_term_retained = true),
  warnings_equivalent boolean not null default false,
  urgency_equivalent boolean not null default false,
  uncertainty_equivalent boolean not null default false,
  blocked_actions_equivalent boolean not null default false,
  created_at timestamptz not null default now(),
  constraint knowledge_localized_terminology_locale_unique unique (terminology_entry_id, output_locale)
);

create index if not exists knowledge_localized_terminology_entry_idx on public.knowledge_localized_terminology (terminology_entry_id);
create index if not exists knowledge_localized_terminology_locale_idx on public.knowledge_localized_terminology (output_locale);

-- =============================================================================
-- GROUP 9 — CROSS-BORDER CORE (structurally representable, inactive by default)
-- =============================================================================

create table if not exists public.knowledge_trust_domain_links (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in (
    'source', 'source_version', 'source_passage', 'publisher', 'jurisdiction', 'territorial_scope',
    'authority', 'authority_competence', 'claim', 'claim_evidence_link', 'process', 'process_step',
    'process_claim_link', 'form', 'form_requirement', 'evidence_requirement', 'deadline_rule', 'fee_rule',
    'eligibility_rule', 'regional_override', 'citation', 'terminology_entry', 'localized_terminology',
    'cross_border_connector', 'cross_border_process', 'responsible_actor_rule'
  )),
  entity_id uuid not null,
  trust_domain_id uuid not null references public.knowledge_trust_domains (id) on delete restrict,
  required boolean not null default true,
  created_at timestamptz not null default now(),
  constraint knowledge_trust_domain_links_unique unique (entity_type, entity_id, trust_domain_id)
);

create index if not exists knowledge_trust_domain_links_trust_domain_idx on public.knowledge_trust_domain_links (trust_domain_id);
create index if not exists knowledge_trust_domain_links_entity_idx on public.knowledge_trust_domain_links (entity_type, entity_id);

-- Cross-border activation must never be inferred from output locale: this is
-- enforced structurally (activation_from_locale_allowed is fixed false) as
-- well as by policy. No connector row is inserted by this migration.
create table if not exists public.knowledge_cross_border_connectors (
  id uuid primary key default gen_random_uuid(),
  origin_market text not null default 'DE' check (origin_market = 'DE'),
  connected_country text not null,
  trust_domain_ids uuid[] not null default '{}',
  status text not null default 'planned' check (status in ('planned', 'prepared', 'active')),
  activation_requires_verified_case_context boolean not null default true check (activation_requires_verified_case_context = true),
  activation_from_locale_allowed boolean not null default false check (activation_from_locale_allowed = false),
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  effective_from timestamptz,
  effective_until timestamptz,
  created_at timestamptz not null default now(),
  constraint knowledge_cross_border_connectors_unique unique (origin_market, connected_country)
);

create index if not exists knowledge_cross_border_connectors_status_idx on public.knowledge_cross_border_connectors (status);

-- Represents the future familienkasse_kindergeld DE<->SK pilot structurally;
-- no row is inserted by this migration.
create table if not exists public.knowledge_cross_border_processes (
  id uuid primary key default gen_random_uuid(),
  cross_border_connector_id uuid not null references public.knowledge_cross_border_connectors (id) on delete restrict,
  german_process_id uuid not null references public.knowledge_processes (id) on delete restrict,
  foreign_process_reference text,
  eu_coordination_claim_ids uuid[] not null default '{}',
  german_claim_ids uuid[] not null default '{}',
  foreign_claim_ids uuid[] not null default '{}',
  responsible_actor_rule_id uuid not null references public.knowledge_responsible_actor_rules (id) on delete restrict,
  authority_resolution_status text not null default 'unresolved',
  evidence_completeness_status text not null default 'incomplete',
  temporal_alignment_status text not null default 'unresolved',
  conflict_status text not null default 'none' check (conflict_status in ('none', 'open', 'resolved', 'blocked')),
  allowed_output_uses text[] not null default '{}',
  blocked_output_uses text[] not null default '{}',
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  created_at timestamptz not null default now(),
  constraint knowledge_cross_border_processes_unique unique (cross_border_connector_id, german_process_id, foreign_process_reference)
);

create index if not exists knowledge_cross_border_processes_connector_idx on public.knowledge_cross_border_processes (cross_border_connector_id);
create index if not exists knowledge_cross_border_processes_german_process_idx on public.knowledge_cross_border_processes (german_process_id);
create index if not exists knowledge_cross_border_processes_responsible_actor_rule_idx on public.knowledge_cross_border_processes (responsible_actor_rule_id);

-- =============================================================================
-- GROUP 10 — RETRIEVAL METADATA (no embeddings, no vector index/extension)
-- =============================================================================

-- Vector similarity is never authoritative by itself: authoritative_by_vector_similarity
-- is fixed false at the schema level. No embeddings and no vector index are
-- created in this phase; this table only prepares structural metadata.
create table if not exists public.knowledge_retrieval_metadata (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in (
    'source', 'source_version', 'source_passage', 'publisher', 'jurisdiction', 'territorial_scope',
    'authority', 'authority_competence', 'claim', 'claim_evidence_link', 'process', 'process_step',
    'process_claim_link', 'form', 'form_requirement', 'evidence_requirement', 'deadline_rule', 'fee_rule',
    'eligibility_rule', 'regional_override', 'citation', 'terminology_entry', 'localized_terminology',
    'trust_domain', 'cross_border_connector', 'cross_border_process', 'responsible_actor_rule'
  )),
  entity_id uuid not null,
  full_text_indexed boolean not null default false,
  vector_indexed boolean not null default false,
  embedding_model text,
  embedding_version text,
  indexed_at timestamptz,
  jurisdiction_filter_required boolean not null default true check (jurisdiction_filter_required = true),
  effective_date_filter_required boolean not null default true check (effective_date_filter_required = true),
  review_status_filter_required boolean not null default true check (review_status_filter_required = true),
  trust_domain_filter_required boolean not null default true check (trust_domain_filter_required = true),
  authoritative_by_vector_similarity boolean not null default false check (authoritative_by_vector_similarity = false),
  created_at timestamptz not null default now(),
  constraint knowledge_retrieval_metadata_unique unique (entity_type, entity_id)
);

-- =============================================================================
-- IMMUTABILITY ENFORCEMENT (bounded, honestly-scoped)
-- =============================================================================
-- Once a source version is locked (locked_at set by application/governance
-- workflow at acceptance), its identity/content columns cannot be mutated.
-- Draft -> machine_prechecked -> human_reviewed -> accepted transitions remain
-- fully possible before locking; review_status, freshness_status, change_status,
-- superseded_by_version_id, historical_use_allowed and current_use_allowed
-- remain mutable even after locking so supersession bookkeeping can proceed.
--
-- RESIDUAL ENFORCEMENT DEBT (honestly recorded, not a claim of perfect
-- immutability): knowledge_review_records, knowledge_freshness_records,
-- knowledge_conflicts and knowledge_audit_events rely in this phase on
-- fail-closed RLS (no anon/authenticated UPDATE/DELETE policy) and the
-- absence of cascading deletes, not on a dedicated append-only trigger.
-- A generic append-only trigger for those tables is deferred to a later
-- phase rather than implemented unsafely here.

create or replace function public.knowledge_source_versions_protect_locked_content()
returns trigger
language plpgsql
as $$
begin
  if old.locked_at is not null then
    if new.content_hash is distinct from old.content_hash
       or new.source_id is distinct from old.source_id
       or new.version_sequence is distinct from old.version_sequence
       or new.raw_content_location is distinct from old.raw_content_location
       or new.normalized_content_location is distinct from old.normalized_content_location
       or new.immutable is distinct from old.immutable
       or new.locked_at is distinct from old.locked_at
    then
      raise exception 'knowledge_source_versions: locked authoritative content cannot be mutated (id=%)', old.id;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists knowledge_source_versions_protect_locked_content on public.knowledge_source_versions;
create trigger knowledge_source_versions_protect_locked_content
  before update on public.knowledge_source_versions
  for each row
  execute function public.knowledge_source_versions_protect_locked_content();

revoke all on function public.knowledge_source_versions_protect_locked_content() from public;

-- =============================================================================
-- ROW-LEVEL SECURITY: fail-closed. Every knowledge_* table below has RLS
-- enabled and zero policies for anon/authenticated. Service-role bypasses RLS
-- per normal Supabase behavior; no policy grants it anything extra here.
-- Approved read projections/policies are deferred to a later, validated phase.
-- =============================================================================

alter table public.knowledge_trust_domains enable row level security;
alter table public.knowledge_jurisdictions enable row level security;
alter table public.knowledge_territorial_scopes enable row level security;
alter table public.knowledge_publishers enable row level security;
alter table public.knowledge_sources enable row level security;
alter table public.knowledge_source_versions enable row level security;
alter table public.knowledge_source_passages enable row level security;
alter table public.knowledge_authorities enable row level security;
alter table public.knowledge_authority_competences enable row level security;
alter table public.knowledge_claims enable row level security;
alter table public.knowledge_claim_evidence_links enable row level security;
alter table public.knowledge_citations enable row level security;
alter table public.knowledge_responsible_actor_rules enable row level security;
alter table public.knowledge_processes enable row level security;
alter table public.knowledge_forms enable row level security;
alter table public.knowledge_deadline_rules enable row level security;
alter table public.knowledge_fee_rules enable row level security;
alter table public.knowledge_process_steps enable row level security;
alter table public.knowledge_evidence_requirements enable row level security;
alter table public.knowledge_form_requirements enable row level security;
alter table public.knowledge_eligibility_rules enable row level security;
alter table public.knowledge_process_claim_links enable row level security;
alter table public.knowledge_regional_overrides enable row level security;
alter table public.knowledge_review_records enable row level security;
alter table public.knowledge_freshness_records enable row level security;
alter table public.knowledge_conflicts enable row level security;
alter table public.knowledge_audit_events enable row level security;
alter table public.knowledge_terminology enable row level security;
alter table public.knowledge_localized_terminology enable row level security;
alter table public.knowledge_trust_domain_links enable row level security;
alter table public.knowledge_cross_border_connectors enable row level security;
alter table public.knowledge_cross_border_processes enable row level security;
alter table public.knowledge_retrieval_metadata enable row level security;

-- Explicit defense-in-depth revokes for the newly created objects only
-- (no unrelated existing table's privileges are touched by this migration).
revoke all on public.knowledge_trust_domains from public, anon, authenticated;
revoke all on public.knowledge_jurisdictions from public, anon, authenticated;
revoke all on public.knowledge_territorial_scopes from public, anon, authenticated;
revoke all on public.knowledge_publishers from public, anon, authenticated;
revoke all on public.knowledge_sources from public, anon, authenticated;
revoke all on public.knowledge_source_versions from public, anon, authenticated;
revoke all on public.knowledge_source_passages from public, anon, authenticated;
revoke all on public.knowledge_authorities from public, anon, authenticated;
revoke all on public.knowledge_authority_competences from public, anon, authenticated;
revoke all on public.knowledge_claims from public, anon, authenticated;
revoke all on public.knowledge_claim_evidence_links from public, anon, authenticated;
revoke all on public.knowledge_citations from public, anon, authenticated;
revoke all on public.knowledge_responsible_actor_rules from public, anon, authenticated;
revoke all on public.knowledge_processes from public, anon, authenticated;
revoke all on public.knowledge_forms from public, anon, authenticated;
revoke all on public.knowledge_deadline_rules from public, anon, authenticated;
revoke all on public.knowledge_fee_rules from public, anon, authenticated;
revoke all on public.knowledge_process_steps from public, anon, authenticated;
revoke all on public.knowledge_evidence_requirements from public, anon, authenticated;
revoke all on public.knowledge_form_requirements from public, anon, authenticated;
revoke all on public.knowledge_eligibility_rules from public, anon, authenticated;
revoke all on public.knowledge_process_claim_links from public, anon, authenticated;
revoke all on public.knowledge_regional_overrides from public, anon, authenticated;
revoke all on public.knowledge_review_records from public, anon, authenticated;
revoke all on public.knowledge_freshness_records from public, anon, authenticated;
revoke all on public.knowledge_conflicts from public, anon, authenticated;
revoke all on public.knowledge_audit_events from public, anon, authenticated;
revoke all on public.knowledge_terminology from public, anon, authenticated;
revoke all on public.knowledge_localized_terminology from public, anon, authenticated;
revoke all on public.knowledge_trust_domain_links from public, anon, authenticated;
revoke all on public.knowledge_cross_border_connectors from public, anon, authenticated;
revoke all on public.knowledge_cross_border_processes from public, anon, authenticated;
revoke all on public.knowledge_retrieval_metadata from public, anon, authenticated;

-- =============================================================================
-- NO SEED DATA: zero INSERT statements below this line, and none above.
-- Trust domains (eu/de/sk/cz/pl/hu) are structurally representable via the
-- CHECK constraint on knowledge_trust_domains.code but remain an empty table.
-- =============================================================================
