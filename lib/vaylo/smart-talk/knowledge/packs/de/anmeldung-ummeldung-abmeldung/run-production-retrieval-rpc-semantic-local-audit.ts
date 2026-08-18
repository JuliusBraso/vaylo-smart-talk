import { Client, type QueryResultRow } from "pg";

import { PACK_ENTITY_IDS, stablePackEntityId } from "./identity";

const RPC_SIGNATURE = "public.knowledge_retrieve_evidence_packets(uuid[],text[])";
const QUESTION_UNITS = Object.freeze({
  Q1: ["anmeldung-deadline-two-weeks", "anmeldung-duty"],
  Q2: ["domestic-move-new-registration", "abmeldung-duty-no-new-domestic-home"],
  Q3: ["landlord-confirmation-missing-notice", "landlord-participation", "landlord-confirmation"],
  Q4: ["abmeldung-duty-no-new-domestic-home", "abmeldung-deadline-two-weeks", "abmeldung-earliest-one-week"],
  Q5: ["ordinary-registration-fine-framework", "late-anmeldung-offence"],
  MUNICH: ["anmeldung-duty", "identity-and-confirmation"],
  BERLIN: ["anmeldung-duty", "identity-and-confirmation"],
  SLOVAK_UI: ["anmeldung-duty", "anmeldung-deadline-two-weeks"],
} as const);

type QuestionId = keyof typeof QUESTION_UNITS;
type CaseResult = Readonly<{
  caseId: string;
  expected: string;
  observed: string;
  passed: boolean;
}>;

function localUrl(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  const parsed = new URL(value);
  if (!["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
    throw new Error(`${name} must use localhost`);
  }
  if (/prod|supabase\.co|pooler/i.test(value)) {
    throw new Error(`${name} rejects hosted or production-looking connections`);
  }
  return value;
}

function claimId(unitId: string): string {
  return stablePackEntityId(`claim:${unitId}`);
}

function textArray(value: unknown): readonly string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
    const body = value.slice(1, -1);
    return body.length === 0 ? [] : body.split(",");
  }
  return [];
}

async function retrieve(
  client: Client,
  claimIds: readonly string[],
  jurisdictions: readonly string[],
): Promise<QueryResultRow[]> {
  const result = await client.query(
    "select * from public.knowledge_retrieve_evidence_packets($1::uuid[], $2::text[])",
    [claimIds, jurisdictions],
  );
  return result.rows;
}

async function expectDenied(client: Client, sql: string): Promise<boolean> {
  try {
    await client.query(sql);
    return false;
  } catch {
    return true;
  }
}

async function expectInvalidInput(
  reader: Client,
  claimIds: readonly string[],
  jurisdictions: readonly string[],
): Promise<boolean> {
  try {
    await retrieve(reader, claimIds, jurisdictions);
    return false;
  } catch (error) {
    return error instanceof Error && error.message.includes("CURATED_RETRIEVAL_INVALID_REQUEST");
  }
}

async function withTamper(
  admin: Client,
  mutationSql: string,
  mutationParams: readonly unknown[],
  test: () => Promise<Readonly<{ passed: boolean; observed: string }>>,
): Promise<Readonly<{ passed: boolean; observed: string }>> {
  await admin.query("begin");
  try {
    await admin.query(mutationSql, [...mutationParams]);
    await admin.query("set local role birello_knowledge_reader");
    return await test();
  } finally {
    await admin.query("rollback");
  }
}

async function excludedAfter(
  admin: Client,
  targetClaimId: string,
  mutationSql: string,
  mutationParams: readonly unknown[],
): Promise<Readonly<{ passed: boolean; observed: string }>> {
  return withTamper(admin, mutationSql, mutationParams, async () => {
    const rows = await retrieve(admin, [targetClaimId], ["DE"]);
    return { passed: rows.length === 0, observed: `${rows.length} rows returned` };
  });
}

async function main(): Promise<void> {
  const admin = new Client({
    connectionString: localUrl("BIRELLO_LOCAL_RETRIEVAL_ADMIN_URL"),
  });
  const reader = new Client({
    connectionString: localUrl("BIRELLO_LOCAL_RETRIEVAL_READER_URL"),
  });
  await admin.connect();
  await reader.connect();

  const positiveCases: Record<QuestionId, boolean> = {
    Q1: false,
    Q2: false,
    Q3: false,
    Q4: false,
    Q5: false,
    MUNICH: false,
    BERLIN: false,
    SLOVAK_UI: false,
  };
  const negativeCases: CaseResult[] = [];
  const targetClaimId = claimId("anmeldung-duty");

  try {
    const identity = await reader.query(
      `select current_user as role_name,
              r.rolsuper, r.rolbypassrls, r.rolcreatedb, r.rolcreaterole
         from pg_catalog.pg_roles r
        where r.rolname = current_user`,
    );
    if (
      identity.rows[0]?.role_name !== "birello_knowledge_reader"
      || identity.rows[0]?.rolsuper
      || identity.rows[0]?.rolbypassrls
      || identity.rows[0]?.rolcreatedb
      || identity.rows[0]?.rolcreaterole
    ) {
      throw new Error("Reader identity is absent or over-privileged");
    }

    await reader.query("begin read only");
    try {
      for (const questionId of Object.keys(QUESTION_UNITS) as QuestionId[]) {
        const ids = QUESTION_UNITS[questionId].map(claimId);
        const rows = await retrieve(reader, ids, ["DE"]);
        const returnedIds = new Set(rows.map((row) => String(row.claim_id)));
        const exactIds = ids.length === rows.length && ids.every((id) => returnedIds.has(id));
        const completePackets = rows.every(
          (row) =>
            row.canonical_language === "de"
            && row.jurisdiction_code === "DE"
            && typeof row.canonical_proposition === "string"
            && row.canonical_proposition.length > 0
            && row.source_id
            && row.source_version_id
            && row.source_passage_id
            && row.legal_locator
            && row.citation_reference
            && row.handling_mode
            && typeof row.canonical_value_usable === "boolean"
            && row.stale_behavior
            && (
              Array.isArray(row.required_context_keys)
              || (
                typeof row.required_context_keys === "string"
                && row.required_context_keys.startsWith("{")
                && row.required_context_keys.endsWith("}")
              )
            )
            && typeof row.full_text_indexed === "boolean"
            && typeof row.vector_indexed === "boolean"
            && Object.hasOwn(row, "indexed_at")
            && typeof row.effective_date_filter_required === "boolean"
            && typeof row.stale_policy_filter_required === "boolean",
        );
        const localitySafe =
          !["MUNICH", "BERLIN"].includes(questionId)
          || rows.every(
            (row) =>
              row.jurisdiction_code === "DE"
              && !Object.keys(row).some((key) =>
                /office|address|appointment|fee|form|municipality/i.test(key),
              ),
          );
        positiveCases[questionId] = exactIds && completePackets && localitySafe;
      }
      await reader.query("commit");
    } catch (error) {
      await reader.query("rollback");
      throw error;
    }

    const addCase = async (
      caseId: string,
      expected: string,
      operation: Promise<Readonly<{ passed: boolean; observed: string }>>,
    ) => {
      const result = await operation;
      negativeCases.push({ caseId, expected, ...result });
    };

    await addCase("N1_INACTIVE_CLAIM", "excluded", excludedAfter(
      admin, targetClaimId,
      "update public.knowledge_claims set status='superseded' where id=$1", [targetClaimId],
    ));
    await addCase("N2_NON_EXPERT_CLAIM", "excluded", excludedAfter(
      admin, targetClaimId,
      "update public.knowledge_claims set review_status='human_reviewed' where id=$1", [targetClaimId],
    ));
    await addCase("N3_STALE_CLAIM", "excluded", excludedAfter(
      admin, targetClaimId,
      "update public.knowledge_claims set freshness_status='stale' where id=$1", [targetClaimId],
    ));
    const wrongJurisdiction = await retrieve(reader, [targetClaimId], ["SK"]);
    negativeCases.push({
      caseId: "N4_WRONG_JURISDICTION",
      expected: "excluded",
      observed: `${wrongJurisdiction.length} rows returned`,
      passed: wrongJurisdiction.length === 0,
    });
    await addCase("N5_EVIDENCE_NOT_ACCEPTED", "excluded", excludedAfter(
      admin, targetClaimId,
      "update public.knowledge_claim_evidence_links set review_accepted=false where claim_id=$1", [targetClaimId],
    ));
    await addCase("N6_NON_DIRECT_EVIDENCE", "excluded", excludedAfter(
      admin, targetClaimId,
      "update public.knowledge_claim_evidence_links set support_status='partial_support' where claim_id=$1", [targetClaimId],
    ));
    await addCase("N7_EVIDENCE_SCOPE_MISMATCH", "excluded", excludedAfter(
      admin, targetClaimId,
      "update public.knowledge_claim_evidence_links set jurisdiction_match=false where claim_id=$1", [targetClaimId],
    ));
    await addCase("N8_EVIDENCE_DATE_MISMATCH", "excluded", excludedAfter(
      admin, targetClaimId,
      "update public.knowledge_claim_evidence_links set effective_date_match=false where claim_id=$1", [targetClaimId],
    ));
    await addCase("N9_UNAUTHORIZED_SOURCE", "excluded", excludedAfter(
      admin, targetClaimId,
      `update public.knowledge_sources
          set authorization_state='SUSPENDED',
              authorization_state_version=authorization_state_version+1,
              active_status='SUSPENDED',
              trust_status='SUSPENDED'
        where id=$1`,
      [PACK_ENTITY_IDS.source],
    ));
    await addCase("N10_INACTIVE_SOURCE", "excluded", excludedAfter(
      admin, targetClaimId,
      `update public.knowledge_sources
          set authorization_state='DRAFT',
              authorization_state_version=authorization_state_version+1,
              active_status='INACTIVE'
        where id=$1`,
      [PACK_ENTITY_IDS.source],
    ));
    await addCase("N11_UNVERIFIED_SOURCE", "excluded", excludedAfter(
      admin, targetClaimId,
      `update public.knowledge_sources
          set authorization_state='DRAFT',
              authorization_state_version=authorization_state_version+1,
              trust_status='UNVERIFIED'
        where id=$1`,
      [PACK_ENTITY_IDS.source],
    ));
    await addCase("N12_EXPIRED_SOURCE_REVALIDATION", "excluded", excludedAfter(
      admin, targetClaimId,
      "update public.knowledge_sources set revalidation_due_at=statement_timestamp()-interval '1 second' where id=$1", [PACK_ENTITY_IDS.source],
    ));
    await addCase("N13_SOURCE_VERSION_NOT_CURRENT", "excluded", excludedAfter(
      admin, targetClaimId,
      "update public.knowledge_source_versions set current_use_allowed=false where id=$1", [PACK_ENTITY_IDS.version],
    ));
    await addCase("N14_STALE_SOURCE_VERSION", "excluded", excludedAfter(
      admin, targetClaimId,
      "update public.knowledge_source_versions set freshness_status='stale' where id=$1", [PACK_ENTITY_IDS.version],
    ));
    await addCase("N15_SOURCE_VERSION_NOT_APPLICABLE", "excluded", excludedAfter(
      admin, targetClaimId,
      "update public.knowledge_source_versions set applicable_from=statement_timestamp()+interval '1 day' where id=$1", [PACK_ENTITY_IDS.version],
    ));
    await addCase("N16_MISSING_CITATION", "excluded", excludedAfter(
      admin, targetClaimId,
      "delete from public.knowledge_citations where claim_id=$1", [targetClaimId],
    ));
    await addCase("N17_MISSING_RETRIEVAL_METADATA", "excluded", excludedAfter(
      admin, targetClaimId,
      "delete from public.knowledge_retrieval_metadata where entity_type='claim' and entity_id=$1", [targetClaimId],
    ));
    await addCase("N18_METADATA_INDEX_FLAG", "returned with false flag", withTamper(
      admin,
      "update public.knowledge_retrieval_metadata set full_text_indexed=false where entity_type='claim' and entity_id=$1",
      [targetClaimId],
      async () => {
        const rows = await retrieve(admin, [targetClaimId], ["DE"]);
        return {
          passed: rows.length === 1 && rows[0]?.full_text_indexed === false,
          observed: `${rows.length} rows; full_text_indexed=${String(rows[0]?.full_text_indexed)}`,
        };
      },
    ));
    await addCase("N19_BLOCKING_CONFLICT", "excluded", excludedAfter(
      admin, targetClaimId,
      `insert into public.knowledge_conflicts
         (conflict_type, entity_ids, status, severity, blocks_high_risk_use)
       values ('semantic_tamper_audit', array[$1::uuid], 'open', 'high', true)`,
      [targetClaimId],
    ));
    await addCase("N20_NON_RETRIEVABLE_PUBLICATION", "excluded", withTamper(
      admin,
      "select public.knowledge_bootstrap_publication_subject('claim',$1,'local-semantic-audit','local-semantic-audit-publication')",
      [targetClaimId],
      async () => {
        const rows = await retrieve(admin, [targetClaimId], ["DE"]);
        return { passed: rows.length === 0, observed: `${rows.length} rows returned for draft state` };
      },
    ));

    const publicationAbsent = await admin.query(
      "select not exists (select 1 from public.knowledge_publication_states where entity_type='claim' and entity_id=$1) as absent",
      [targetClaimId],
    );
    const publicationAbsentRows = await retrieve(reader, [targetClaimId], ["DE"]);
    const publicationAbsenceCompatibilityPassed =
      publicationAbsent.rows[0]?.absent === true && publicationAbsentRows.length === 1;
    negativeCases.push({
      caseId: "N21_ABSENT_PUBLICATION_COMPATIBILITY",
      expected: "eligible",
      observed: `${publicationAbsentRows.length} rows returned with publication state absent`,
      passed: publicationAbsenceCompatibilityPassed,
    });

    const handlingCases = [
      ["N22_STORE_CANONICALLY", "STORE_CANONICALLY", "{}", null, true],
      ["N23_FETCH_LIVE", "FETCH_LIVE", "{}", null, false],
      ["N24_CACHE_AND_REVALIDATE", "CACHE_AND_REVALIDATE", "{}", "1 day", true],
      ["N25_MANUAL_REVIEW", "MANUAL_REVIEW_REQUIRED", "{}", null, false],
      ["N26_CONTEXT_REQUIRED", "DO_NOT_ANSWER_WITHOUT_CONTEXT", "{MUNICIPALITY}", null, false],
    ] as const;
    for (const [caseId, mode, contextKeys, dueInterval, expectedUsable] of handlingCases) {
      await addCase(caseId, `returned with canonical_value_usable=${expectedUsable}`, withTamper(
        admin,
        `update public.knowledge_source_handling_policies
            set handling_mode=$1::public.knowledge_handling_mode,
                required_context_keys=$2::public.knowledge_required_context_key[],
                revalidation_due_at=case when $3::text is null then null
                  else statement_timestamp()+($3::text)::interval end
          where source_id=$4 and information_class='LEGAL_BASELINE'
            and process_scope='anmeldung_ummeldung_abmeldung'`,
        [mode, contextKeys, dueInterval, PACK_ENTITY_IDS.source],
        async () => {
          const rows = await retrieve(admin, [targetClaimId], ["DE"]);
          const row = rows[0];
          const contextCorrect =
            mode !== "DO_NOT_ANSWER_WITHOUT_CONTEXT"
            || textArray(row?.required_context_keys).includes("MUNICIPALITY");
          const revalidationVisible =
            mode !== "CACHE_AND_REVALIDATE" || row?.revalidation_due_at != null;
          return {
            passed:
              rows.length === 1
              && row?.handling_mode === mode
              && row?.canonical_value_usable === expectedUsable
              && contextCorrect
              && revalidationVisible,
            observed:
              `${rows.length} rows; mode=${String(row?.handling_mode)}; `
              + `canonical_value_usable=${String(row?.canonical_value_usable)}`,
          };
        },
      ));
    }

    const directSelectDenied =
      await expectDenied(reader, "select * from public.knowledge_claims")
      && await expectDenied(reader, "select * from public.knowledge_claim_evidence_links");
    const writesDenied =
      await expectDenied(reader, "insert into public.knowledge_claims default values")
      && await expectDenied(reader, "update public.knowledge_claims set status='active'")
      && await expectDenied(reader, "delete from public.knowledge_claims");
    const ingestionRpcDenied = await expectDenied(
      reader,
      "select public.knowledge_ingest_curated_pack('{}'::jsonb)",
    );
    const schemaCreateDenied = await expectDenied(
      reader,
      "create schema semantic_audit_forbidden",
    );

    const repeatedIds = Array.from({ length: 51 }, () => targetClaimId);
    const repeatedJurisdictions = Array.from({ length: 11 }, () => "DE");
    const inputBounds = {
      emptyClaims: await expectInvalidInput(reader, [], ["DE"]),
      excessiveClaims: await expectInvalidInput(reader, repeatedIds, ["DE"]),
      emptyJurisdictions: await expectInvalidInput(reader, [targetClaimId], []),
      excessiveJurisdictions: await expectInvalidInput(reader, [targetClaimId], repeatedJurisdictions),
      malformedJurisdiction: await expectInvalidInput(reader, [targetClaimId], ["DE;DROP"]),
    };

    const functionContract = await admin.query(
      `select p.prosecdef,
              pg_catalog.pg_get_function_result(p.oid) as result_type,
              pg_catalog.pg_get_functiondef(p.oid) as definition,
              p.proconfig
         from pg_catalog.pg_proc p
         join pg_catalog.pg_namespace n on n.oid=p.pronamespace
        where n.nspname='public'
          and p.proname='knowledge_retrieve_evidence_packets'
          and pg_catalog.pg_get_function_identity_arguments(p.oid)='p_claim_ids uuid[], p_jurisdiction_codes text[]'`,
    );
    const definition = String(functionContract.rows[0]?.definition ?? "");
    const rpcSelectOnly =
      functionContract.rows[0]?.prosecdef === true
      && (functionContract.rows[0]?.proconfig as string[] | undefined)?.includes(
        "search_path=pg_catalog, public",
      )
      && !/\b(insert|update|delete|merge|truncate|create|alter|drop|execute)\b/i.test(
        definition.replace(/create or replace function/i, ""),
      );

    const readOnlyTransactionInvocationPassed = Object.values(positiveCases).every(Boolean);
    const handlingModeMatrixPassed = negativeCases
      .filter(({ caseId }) => /^N2[2-6]_/.test(caseId))
      .every(({ passed }) => passed);
    const explicitNonRetrievablePublicationBlocked =
      negativeCases.find(({ caseId }) => caseId === "N20_NON_RETRIEVABLE_PUBLICATION")?.passed === true;
    const inputBoundsPassed = Object.values(inputBounds).every(Boolean);
    const allPassed =
      Object.values(positiveCases).every(Boolean)
      && negativeCases.every(({ passed }) => passed)
      && directSelectDenied
      && writesDenied
      && ingestionRpcDenied
      && schemaCreateDenied
      && inputBoundsPassed
      && rpcSelectOnly;

    process.stdout.write(`${JSON.stringify({
      checkId: "PKG-R1-CLOSURE",
      allPassed,
      rpcSignature: RPC_SIGNATURE,
      positiveCases,
      negativeCaseCount: negativeCases.length,
      negativeCasesRejectedOrBehavedAsExpected: negativeCases,
      readerDirectSelectDenied: directSelectDenied,
      readerWritesDenied: writesDenied,
      ingestionRpcDenied,
      schemaCreateDenied,
      readOnlyTransactionInvocationPassed,
      publicationAbsenceCompatibilityPassed,
      explicitNonRetrievablePublicationBlocked,
      handlingModeMatrixPassed,
      inputBounds,
      inputBoundsPassed,
      rpcSelectOnly,
      serviceRoleModified: false,
      productionConnectionPerformed: false,
      productionDeploymentPerformed: false,
      productionRetrievalPerformed: false,
      ingestionApplyPerformed: false,
    })}\n`);
    if (!allPassed) process.exitCode = 1;
  } finally {
    await reader.end();
    await admin.end();
  }
}

void main().catch((error: unknown) => {
  process.stderr.write(`${JSON.stringify({
    checkId: "PKG-R1-CLOSURE",
    allPassed: false,
    message: error instanceof Error ? error.message : "Local retrieval semantic audit failed",
    productionConnectionPerformed: false,
  })}\n`);
  process.exitCode = 1;
});
