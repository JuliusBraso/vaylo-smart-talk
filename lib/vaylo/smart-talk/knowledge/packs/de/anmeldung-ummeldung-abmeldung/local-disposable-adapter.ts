import crypto from "node:crypto";
import { Client } from "pg";

import {
  BMG_PASSAGES,
  BMG_SOURCE,
  CANONICAL_UNITS,
  FEDERAL_JURISDICTION_CODE,
} from "./pack";
import { PACK_ENTITY_IDS, stablePackEntityId } from "./identity";
import { validateCanonicalUnits } from "./validator";

export const LOCAL_DISPOSABLE_VALIDATION = "LOCAL_DISPOSABLE_VALIDATION" as const;

export type LocalDisposableIngestionOptions = Readonly<{
  capability: typeof LOCAL_DISPOSABLE_VALIDATION;
  databaseUrl: string;
  dryRun: boolean;
}>;

export type LocalDisposableIngestionResult = Readonly<{
  dryRun: boolean;
  counts: Readonly<Record<string, number>>;
  changes: Readonly<
    Record<
      string,
      Readonly<{
        created: number;
        reused: number;
        updated: number;
        unchanged: number;
      }>
    >
  >;
  validationFailures: readonly string[];
}>;

export const LOCAL_PACK_IDS = PACK_ENTITY_IDS;
export const stableId = stablePackEntityId;
const IDS = PACK_ENTITY_IDS;

function assertLocalDisposable(options: LocalDisposableIngestionOptions): void {
  if (options.capability !== LOCAL_DISPOSABLE_VALIDATION) {
    throw new Error("LOCAL_DISPOSABLE_VALIDATION capability is required");
  }
  const parsed = new URL(options.databaseUrl);
  if (!["postgres:", "postgresql:"].includes(parsed.protocol)) {
    throw new Error("A PostgreSQL URL is required");
  }
  if (!["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
    throw new Error("Only a localhost disposable database is permitted");
  }
  if (/prod|supabase\.co|pooler/i.test(options.databaseUrl)) {
    throw new Error("Production and hosted credentials are forbidden");
  }
}

async function upsertFoundation(client: Client): Promise<void> {
  await client.query(
    `insert into public.knowledge_trust_domains (id, code, name, review_status)
     values ($1, 'de', 'Deutschland', 'expert_reviewed')
     on conflict (id) do update set code = excluded.code, name = excluded.name`,
    [IDS.trustDomain],
  );
  await client.query(
    `insert into public.knowledge_jurisdictions (id, jurisdiction_level, jurisdiction_code, country_code, name, status)
     values ($1, 'de_federal', $2, 'DE', 'Bundesrepublik Deutschland', 'active')
     on conflict (id) do update set jurisdiction_code = excluded.jurisdiction_code, name = excluded.name, status = excluded.status`,
    [IDS.jurisdiction, FEDERAL_JURISDICTION_CODE],
  );
  await client.query(
    `insert into public.knowledge_territorial_scopes (id, scope_type, jurisdiction_ids, scope_verified, review_status)
     values ($1, 'national', array[$2]::uuid[], true, 'expert_reviewed')
     on conflict (id) do update set jurisdiction_ids = excluded.jurisdiction_ids, scope_verified = true, review_status = 'expert_reviewed'`,
    [IDS.territorialScope, IDS.jurisdiction],
  );
  await client.query(
    `insert into public.knowledge_publishers (id, publisher_name, publisher_type, official_status, subject_matter_competence, territorial_competence_id, trust_domain_id, review_status)
     values ($1, $2, 'federal_publication', true, array['Melderecht'], $3, $4, 'expert_reviewed')
     on conflict (id) do update set official_status = true, territorial_competence_id = excluded.territorial_competence_id, review_status = 'expert_reviewed'`,
    [IDS.publisher, BMG_SOURCE.publisher, IDS.territorialScope, IDS.trustDomain],
  );
  await client.query(
    `insert into public.knowledge_authorities (id, publisher_id, authority_name, authority_type, jurisdiction_id, territorial_scope_id, official_portal_url, status, review_status)
     values ($1, $2, $3, 'federal_legal_publisher', $4, $5, $6, 'active', 'expert_reviewed')
     on conflict (id) do update set jurisdiction_id = excluded.jurisdiction_id, territorial_scope_id = excluded.territorial_scope_id, review_status = 'expert_reviewed'`,
    [IDS.authority, IDS.publisher, BMG_SOURCE.publisher, IDS.jurisdiction, IDS.territorialScope, BMG_SOURCE.canonicalUrl],
  );
}

async function upsertSourceChain(client: Client): Promise<void> {
  await client.query(
    `insert into public.knowledge_sources (
      id, publisher_id, source_type, source_purpose, canonical_url, official_domain,
      official_domain_verification_status, jurisdiction_id, territorial_scope_id,
      source_language, publication_identifier, supports_claim_types, high_risk_use_allowed,
      normalized_canonical_url, normalized_origin, source_class, evidence_eligibility,
      issuing_authority_id, authority_level, process_scope, retrieval_method,
      terms_or_license_review_status, robots_review_status, first_verified_at, last_verified_at,
      active_status, trust_status, authorization_state, default_handling_mode, freshness_class, stale_behavior
    ) values (
      $1, $2, 'law', 'Bundesmeldegesetz', $3, 'gesetze-im-internet.de',
      'verified', $4, $5, 'de', 'BMG', array['registration_law'], true,
      $3, $6, 'FEDERAL_LAW', 'PUBLICATION_EVIDENCE_ELIGIBLE',
      $7, 'FEDERAL', array['anmeldung_ummeldung_abmeldung'], 'HTML_DOCUMENT',
      'ALLOWED', 'ALLOWED', now(), now(),
      'ACTIVE', 'VERIFIED', 'AUTHORIZED', 'STORE_CANONICALLY', 'LEGAL_CHANGE_MONITORED', 'DO_NOT_USE_STALE'
    ) on conflict (id) do update set
      normalized_canonical_url = excluded.normalized_canonical_url,
      evidence_eligibility = excluded.evidence_eligibility,
      authorization_state = excluded.authorization_state,
      active_status = excluded.active_status,
      trust_status = excluded.trust_status`,
    [IDS.source, IDS.publisher, BMG_SOURCE.canonicalUrl, IDS.jurisdiction, IDS.territorialScope, BMG_SOURCE.normalizedOrigin, IDS.authority],
  );
  const versionHash = crypto.createHash("sha256").update(BMG_PASSAGES.map((item) => item.text).join("\n")).digest("hex");
  await client.query(
    `insert into public.knowledge_source_versions (
      id, source_id, version_sequence, content_hash, review_status, freshness_status,
      change_status, immutable, historical_use_allowed, current_use_allowed
    ) values ($1, $2, 1, $3, 'expert_reviewed', 'fresh', 'unchanged', true, true, true)
    on conflict (id) do update set content_hash = excluded.content_hash, review_status = 'expert_reviewed', freshness_status = 'fresh', current_use_allowed = true`,
    [IDS.version, IDS.source, versionHash],
  );
  for (const [index, passage] of BMG_PASSAGES.entries()) {
    await client.query(
      `insert into public.knowledge_source_passages (
        id, source_version_id, passage_order, heading_path, section_identifier,
        text, text_hash, language, citation_ready, review_status
      ) values ($1, $2, $3, array['Bundesmeldegesetz'], $4, $5, $6, 'de', true, 'expert_reviewed')
      on conflict (id) do update set text = excluded.text, text_hash = excluded.text_hash, citation_ready = true, review_status = 'expert_reviewed'`,
      [stableId(passage.id), IDS.version, index, passage.locator, passage.text, crypto.createHash("sha256").update(passage.text).digest("hex")],
    );
  }
}

async function upsertClaims(client: Client): Promise<void> {
  for (const unit of CANONICAL_UNITS) {
    const claimId = stableId(`claim:${unit.id}`);
    const passage = BMG_PASSAGES.find((item) => item.id === unit.passageId);
    if (!passage) throw new Error(`Missing passage ${unit.passageId}`);
    const passageId = stableId(passage.id);
    await client.query(
      `insert into public.knowledge_claims (
        id, claim_type, claim_text_canonical, claim_language, market, jurisdiction_id,
        territorial_scope_id, authority_id, risk_level, allowed_output_uses,
        requires_direct_support, requires_effective_date, requires_authority_resolution,
        review_status, freshness_status, status
      ) values ($1, $2, $3, 'de', 'DE', $4, $5, $6, 'medium', array['orientation'],
        true, true, false, 'expert_reviewed', 'fresh', 'active')
      on conflict (id) do update set claim_text_canonical = excluded.claim_text_canonical, review_status = 'expert_reviewed', freshness_status = 'fresh'`,
      [claimId, unit.claimType, unit.text, IDS.jurisdiction, IDS.territorialScope, IDS.authority],
    );
    await client.query(
      `insert into public.knowledge_claim_evidence_links (
        id, claim_id, source_version_id, passage_id, support_status, evidence_role,
        is_primary_evidence, jurisdiction_match, territorial_scope_match,
        authority_competence_match, effective_date_match, review_accepted, authorized_use
      ) values ($1, $2, $3, $4, 'direct_support', 'legal_basis', true, true, true, true, true, true, array['orientation'])
      on conflict (claim_id, passage_id, evidence_role) do update set review_accepted = true, support_status = 'direct_support'`,
      [stableId(`evidence:${unit.id}`), claimId, IDS.version, passageId],
    );
    await client.query(
      `insert into public.knowledge_citations (
        id, claim_id, source_id, source_version_id, passage_id, publisher_id, jurisdiction_id,
        last_verified_at, user_facing_label, internal_audit_label, original_language, canonical_url
      ) values ($1, $2, $3, $4, $5, $6, $7, now(), $8, $8, 'de', $9)
      on conflict (id) do update set last_verified_at = now(), canonical_url = excluded.canonical_url`,
      [stableId(`citation:${unit.id}`), claimId, IDS.source, IDS.version, passageId, IDS.publisher, IDS.jurisdiction, passage.locator, passage.url],
    );
  }
}

async function upsertProcessModel(client: Client): Promise<void> {
  await client.query(
    `insert into public.knowledge_responsible_actor_rules (
      id, actor_state, user_must_act, german_authority_must_act, jurisdiction_id,
      territorial_scope_id, review_status, concrete_instruction_allowed
    ) values ($1, 'meldepflichtige_person', true, true, $2, $3, 'expert_reviewed', false)
    on conflict (id) do update set review_status = 'expert_reviewed'`,
    [IDS.actorRule, IDS.jurisdiction, IDS.territorialScope],
  );
  const processes = [
    [IDS.anmeldungProcess, "Anmeldung einer Wohnung", "Einzug in eine Wohnung", "Wohnungsgeberbestätigung oder Mitteilung bei fehlender Bestätigung vorbereiten und Anmeldung bei der Meldebehörde innerhalb der Frist vornehmen."],
    [IDS.ummeldungProcess, "Ummeldung bei Umzug innerhalb Deutschlands", "Bezug einer neuen Wohnung im Inland", "Anmeldung bei der neuen Meldebehörde vorbereiten; eine gesonderte Abmeldung der bisherigen Inlandwohnung ist nach § 17 Absatz 2 nicht der gesetzliche Wegzugstatbestand."],
    [IDS.abmeldungProcess, "Abmeldung bei Wegzug ohne neue Wohnung im Inland", "Auszug ohne neue Wohnung im Inland", "Abmeldung bei der Meldebehörde innerhalb der Frist vorbereiten; bei Wegzug ins Ausland ist schriftliche oder elektronische Abmeldung vorgesehen."],
  ] as const;
  for (const [id, title, trigger, firstStep] of processes) {
    await client.query(
      `insert into public.knowledge_processes (
        id, process_group_id, title, jurisdiction_id, territorial_scope_id, risk_level,
        orientation_only, trigger_description, safe_first_step, regional_variation_expected,
        full_legal_advice_excluded, review_status
      ) values ($1, 'anmeldung_ummeldung_abmeldung', $2, $3, $4, 'medium', true, $5, $6, true, true, 'expert_reviewed')
      on conflict (id) do update set title = excluded.title, review_status = 'expert_reviewed'`,
      [id, title, IDS.jurisdiction, IDS.territorialScope, trigger, firstStep],
    );
  }
  const deadlines = [
    ["anmeldung", "einzug", "einzug", 2, "weeks", "bmg-17-1"],
    ["abmeldung", "auszug", "auszug", 2, "weeks", "bmg-17-2"],
    ["abmeldung_fruestestens", "auszug", "auszug", 1, "week_before", "bmg-17-2"],
  ] as const;
  for (const [type, event, source, duration, unit, passageKey] of deadlines) {
    const passageId = stableId(passageKey);
    await client.query(
      `insert into public.knowledge_deadline_rules (
        id, deadline_type, trigger_event_type, trigger_date_source, duration_value,
        duration_unit, jurisdiction_id, territorial_scope_id, authority_id,
        source_version_id, passage_id, exact_calculation_allowed, risk_level, review_status
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, false, 'medium', 'expert_reviewed')
      on conflict (id) do update set review_status = 'expert_reviewed'`,
      [stableId(`deadline:${type}`), type, event, source, duration, unit, IDS.jurisdiction, IDS.territorialScope, IDS.authority, IDS.version, passageId],
    );
  }
  const processSteps = [
    [IDS.anmeldungProcess, "anmeldung", "Wohnung anmelden", "bmg-17-1"],
    [IDS.ummeldungProcess, "ummeldung", "Neue Wohnung anmelden", "bmg-17-1"],
    [IDS.abmeldungProcess, "abmeldung", "Wegzug abmelden", "bmg-17-2"],
  ] as const;
  for (const [processId, type, title] of processSteps) {
    await client.query(
      `insert into public.knowledge_process_steps (
        id, process_id, step_order, step_type, title, responsible_actor_rule_id,
        authority_id, deadline_rule_id, allowed_output_uses, review_status
      ) values ($1, $2, 0, $3, $4, $5, $6, $7, array['orientation'], 'expert_reviewed')
      on conflict (id) do update set title = excluded.title, review_status = 'expert_reviewed'`,
      [stableId(`step:${type}`), processId, type, title, IDS.actorRule, IDS.authority, stableId(`deadline:${type === "ummeldung" ? "anmeldung" : type}`)],
    );
    await client.query(
      `insert into public.knowledge_evidence_requirements (
        id, name, category, description_canonical, required_by_process_id, required_by_step_id,
        responsible_actor_rule_id, user_submission_expected, source_version_id, passage_id,
        jurisdiction_id, territorial_scope_id, review_status
      ) values ($1, 'Wohnungsgeberbestätigung oder Zuordnungsmerkmal', 'registration_evidence', 'Nach § 23 ist die gesetzlich vorgesehene Bestätigung oder das Zuordnungsmerkmal vorzulegen.', $2, $3, $4, true, $5, $6, $7, $8, 'expert_reviewed')
      on conflict (id) do update set review_status = 'expert_reviewed'`,
      [stableId(`requirement:${type}`), processId, stableId(`step:${type}`), IDS.actorRule, IDS.version, stableId("bmg-23-1"), IDS.jurisdiction, IDS.territorialScope],
    );
  }
}

const HANDLING_POLICIES = Object.freeze([
  "LEGAL_BASELINE",
  "PROCESS_IDENTITY",
  "REQUIRED_EVIDENCE",
  "DEADLINE",
  "SANCTION",
] as const);

async function upsertHandlingAndRetrievalMetadata(client: Client): Promise<void> {
  for (const informationClass of HANDLING_POLICIES) {
    await client.query(
      `insert into public.knowledge_source_handling_policies (
        id, source_id, information_class, process_scope, handling_mode,
        freshness_class, stale_behavior, required_context_keys, risk_class, state_version
      ) values ($1, $2, $3, 'anmeldung_ummeldung_abmeldung',
        'STORE_CANONICALLY', 'LEGAL_CHANGE_MONITORED', 'DO_NOT_USE_STALE', '{}', 'HIGH', 1)
      on conflict (source_id, information_class, process_scope) do nothing`,
      [stableId(`handling:${informationClass}`), IDS.source, informationClass],
    );
  }
  for (const [entityType, entityId] of [
    ["source", IDS.source],
    ["source_version", IDS.version],
  ] as const) {
    await client.query(
      `insert into public.knowledge_freshness_records (
        id, entity_type, entity_id, freshness_status, source_available,
        content_hash_matches, change_status, effective_date_known, review_required,
        notes
      ) values ($1, $2, $3, 'fresh', true, true, 'unchanged', false, false,
        'Official BMG source observed for local disposable validation; future source change requires revalidation.')
      on conflict (id) do nothing`,
      [stableId(`freshness:${entityType}:${entityId}`), entityType, entityId],
    );
  }
  for (const unit of CANONICAL_UNITS) {
    await client.query(
      `insert into public.knowledge_retrieval_metadata (
        id, entity_type, entity_id, full_text_indexed, vector_indexed,
        jurisdiction_filter_required, effective_date_filter_required,
        review_status_filter_required, trust_domain_filter_required,
        authoritative_by_vector_similarity, source_authorization_filter_required,
        handling_policy_filter_required, stale_policy_filter_required
      ) values ($1, 'claim', $2, true, false, true, true, true, true, false, true, true, true)
      on conflict (entity_type, entity_id) do nothing`,
      [stableId(`retrieval:claim:${unit.id}`), stableId(`claim:${unit.id}`)],
    );
  }
  for (const [name, definition, passageKey] of [
    ["Wohnungsgeberbestätigung", "Bestätigung des Wohnungsgebers über den Einzug mit den gesetzlich vorgesehenen Angaben.", "bmg-19-3"],
    ["Hauptwohnung", "Bei mehreren Wohnungen im Inland die vorwiegend benutzte Wohnung.", "bmg-21-1-3"],
    ["Nebenwohnung", "Jede weitere Wohnung eines Einwohners im Inland.", "bmg-21-1-3"],
    ["Meldebehörde", "Die für die An- und Abmeldung nach dem Bundesmeldegesetz zuständige Behörde.", "bmg-17-1"],
    ["Meldebescheinigung", "Auf Antrag erteilte schriftliche oder elektronische Bescheinigung der Meldebehörde über gesetzlich bezeichnete Meldeangaben.", "bmg-18-1"],
    ["amtliche Meldebestätigung", "Unentgeltliche Bestätigung der Meldebehörde über die erfolgte An- oder Abmeldung.", "bmg-24-2"],
  ] as const) {
    await client.query(
      `insert into public.knowledge_terminology (
        id, canonical_german_term, definition_canonical, jurisdiction_id,
        process_group_ids, source_version_id, passage_id, risk_level, review_status
      ) values ($1, $2, $3, $4, array['anmeldung_ummeldung_abmeldung'], $5, $6, 'medium', 'expert_reviewed')
      on conflict (id) do nothing`,
      [stableId(`term:${name}`), name, definition, IDS.jurisdiction, IDS.version, stableId(passageKey)],
    );
  }
}

const COUNT_SQL = `select
  (select count(*) from public.knowledge_publishers where id = $1)::int as publishers,
  (select count(*) from public.knowledge_sources where id = $2)::int as sources,
  (select count(*) from public.knowledge_source_versions where id = $3)::int as source_versions,
  (select count(*) from public.knowledge_source_passages where source_version_id = $3)::int as source_passages,
  (select count(*) from public.knowledge_claims where jurisdiction_id = $4 and authority_id = $5)::int as claims,
  (select count(*) from public.knowledge_claim_evidence_links e join public.knowledge_claims c on c.id=e.claim_id where c.jurisdiction_id=$4 and c.authority_id=$5)::int as evidence_links,
  (select count(*) from public.knowledge_citations c where c.source_id=$2)::int as citations,
  (select count(*) from public.knowledge_processes where id = any($6::uuid[]))::int as processes,
  (select count(*) from public.knowledge_process_steps s where s.process_id = any($6::uuid[]))::int as process_steps,
  (select count(*) from public.knowledge_deadline_rules where source_version_id=$3)::int as deadline_rules,
  (select count(*) from public.knowledge_evidence_requirements where source_version_id=$3)::int as evidence_requirements,
  (select count(*) from public.knowledge_responsible_actor_rules where id=$7)::int as responsible_actor_rules,
  (select count(*) from public.knowledge_source_handling_policies where source_id=$2)::int as handling_policies,
  (select count(*) from public.knowledge_freshness_records where entity_id in ($2,$3))::int as freshness_records,
  (select count(*) from public.knowledge_retrieval_metadata r join public.knowledge_claims c on c.id=r.entity_id where r.entity_type='claim' and c.jurisdiction_id=$4 and c.authority_id=$5)::int as retrieval_metadata,
  (select count(*) from public.knowledge_terminology where source_version_id=$3)::int as terminology`;

const COUNT_PARAMS: unknown[] = [
  IDS.publisher,
  IDS.source,
  IDS.version,
  IDS.jurisdiction,
  IDS.authority,
  [IDS.anmeldungProcess, IDS.ummeldungProcess, IDS.abmeldungProcess],
  IDS.actorRule,
];

async function packCounts(client: Client): Promise<Record<string, number>> {
  const result = await client.query(COUNT_SQL, COUNT_PARAMS);
  return result.rows[0] as unknown as Record<string, number>;
}

export async function ingestLocalDisposablePack(
  options: LocalDisposableIngestionOptions,
): Promise<LocalDisposableIngestionResult> {
  assertLocalDisposable(options);
  const validationFailures = validateCanonicalUnits(CANONICAL_UNITS).map((item) => `${item.code}:${item.unitId}`);
  if (validationFailures.length > 0) {
    return Object.freeze({
      dryRun: options.dryRun,
      counts: Object.freeze({}),
      changes: Object.freeze({}),
      validationFailures: Object.freeze(validationFailures),
    });
  }

  const client = new Client({ connectionString: options.databaseUrl });
  await client.connect();
  try {
    const role = await client.query(
      `select current_user as user_name,
              (select datdba = (select oid from pg_catalog.pg_roles where rolname = current_user)
                 from pg_catalog.pg_database
                where datname = current_database()) as database_owner`,
    );
    const roleRow = role.rows[0] as
      | Readonly<{ user_name?: unknown; database_owner?: unknown }>
      | undefined;
    if (roleRow?.database_owner !== true) {
      throw new Error(
        "LOCAL_DISPOSABLE_VALIDATION requires the disposable database owner role",
      );
    }
    await client.query("begin");
    const before = await packCounts(client);
    await upsertFoundation(client);
    await upsertSourceChain(client);
    await upsertClaims(client);
    await upsertProcessModel(client);
    await upsertHandlingAndRetrievalMetadata(client);
    const row = await packCounts(client);
    const changes = Object.fromEntries(
      Object.entries(row).map(([entity, count]) => {
        const prior = before[entity] ?? 0;
        return [
          entity,
          Object.freeze({
            created: Math.max(0, count - prior),
            reused: Math.min(prior, count),
            updated: 0,
            unchanged: Math.min(prior, count),
          }),
        ];
      }),
    );
    if (options.dryRun) await client.query("rollback");
    else await client.query("commit");
    return Object.freeze({
      dryRun: options.dryRun,
      counts: Object.freeze(row),
      changes: Object.freeze(changes),
      validationFailures: Object.freeze([]),
    });
  } catch (error) {
    await client.query("rollback").catch(() => undefined);
    throw error;
  } finally {
    await client.end();
  }
}
