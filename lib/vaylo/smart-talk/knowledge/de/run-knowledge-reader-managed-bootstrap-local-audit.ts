import fs from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { stablePackEntityId } from "../packs/de/anmeldung-ummeldung-abmeldung/identity";

const READER = "birello_knowledge_reader";
const MANAGED_ADMIN = "managed_reader_admin";
const LIMITED_ADMIN = "managed_reader_limited";
const BOOTSTRAP_PATH = path.resolve(
  process.cwd(),
  "supabase/bootstrap/003_create_birello_knowledge_reader.sql",
);
const BOOTSTRAP_SQL = fs.readFileSync(BOOTSTRAP_PATH, "utf8");

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

async function resetReader(setup: Client): Promise<void> {
  const exists = await setup.query(
    "select exists(select 1 from pg_catalog.pg_roles where rolname=$1) as present",
    [READER],
  );
  if (!exists.rows[0]?.present) return;
  await setup.query("begin");
  try {
    await setup.query(`set local role ${MANAGED_ADMIN}`);
    await setup.query(
      `do $$
       begin
         execute pg_catalog.format(
           'revoke all privileges on database %I from ${READER}',
           pg_catalog.current_database()
         );
       end;
       $$;
       revoke all privileges on schema public from ${READER};
       revoke all privileges on function
         public.knowledge_retrieve_evidence_packets(uuid[],text[])
         from ${READER};`,
    );
    await setup.query("commit");
  } catch (error) {
    await setup.query("rollback");
    throw error;
  }
  await setup.query(
    `do $$
     begin
       execute pg_catalog.format(
         'revoke all privileges on database %I from ${READER}',
         pg_catalog.current_database()
       );
     end;
     $$;
     revoke all privileges on schema public from ${READER};
     revoke all privileges on function
       public.knowledge_retrieve_evidence_packets(uuid[],text[])
       from ${READER};`,
  );
  await setup.query(`revoke ${READER} from ${MANAGED_ADMIN}`);
  await setup.query(`drop owned by ${READER}`);
  await setup.query(`drop role ${READER}`);
}

async function runBootstrap(client: Client): Promise<void> {
  await client.query(BOOTSTRAP_SQL);
}

async function expectBootstrapFailure(
  client: Client,
  expectedMessage: RegExp,
): Promise<boolean> {
  try {
    await runBootstrap(client);
    return false;
  } catch (error) {
    return error instanceof Error && expectedMessage.test(error.message);
  }
}

async function contractSnapshot(client: Client): Promise<Record<string, unknown>> {
  const result = await client.query(
    `select
       r.rolcanlogin,
       r.rolsuper,
       r.rolcreatedb,
       r.rolcreaterole,
       r.rolinherit,
       r.rolreplication,
       r.rolbypassrls,
       r.rolconnlimit,
       pg_catalog.has_database_privilege($1, current_database(), 'CONNECT') as db_connect,
       pg_catalog.has_database_privilege($1, current_database(), 'CREATE') as db_create,
       pg_catalog.has_schema_privilege($1, 'public', 'USAGE') as public_usage,
       pg_catalog.has_schema_privilege($1, 'public', 'CREATE') as public_create,
       pg_catalog.has_function_privilege(
         $1, 'public.knowledge_retrieve_evidence_packets(uuid[],text[])', 'EXECUTE'
       ) as retrieval_execute,
       pg_catalog.has_function_privilege(
         $1, 'public.knowledge_ingest_curated_pack(jsonb)', 'EXECUTE'
       ) as ingestion_execute,
       (
         select count(*)::int
         from pg_catalog.pg_class c
         join pg_catalog.pg_namespace n on n.oid=c.relnamespace
         where n.nspname='public'
           and c.relname like 'knowledge\\_%' escape '\\'
           and c.relkind in ('r','p','v','m','f')
           and pg_catalog.has_table_privilege($1,c.oid,'SELECT')
       ) as knowledge_select_count,
       (
         select count(*)::int
         from pg_catalog.pg_class c
         join pg_catalog.pg_namespace n on n.oid=c.relnamespace
         where n.nspname='public'
           and c.relname like 'knowledge\\_%' escape '\\'
           and c.relkind in ('r','p','v','m','f')
           and (
             pg_catalog.has_table_privilege($1,c.oid,'INSERT')
             or pg_catalog.has_table_privilege($1,c.oid,'UPDATE')
             or pg_catalog.has_table_privilege($1,c.oid,'DELETE')
             or pg_catalog.has_table_privilege($1,c.oid,'TRUNCATE')
           )
       ) as knowledge_write_count,
       pg_catalog.has_table_privilege(
         $1, 'supabase_migrations.schema_migrations', 'SELECT'
       ) as ledger_select,
       (
         pg_catalog.has_table_privilege(
           $1, 'supabase_migrations.schema_migrations', 'INSERT'
         )
         or pg_catalog.has_table_privilege(
           $1, 'supabase_migrations.schema_migrations', 'UPDATE'
         )
         or pg_catalog.has_table_privilege(
           $1, 'supabase_migrations.schema_migrations', 'DELETE'
         )
       ) as ledger_write
     from pg_catalog.pg_roles r
     where r.rolname=$1`,
    [READER],
  );
  return result.rows[0] as Record<string, unknown>;
}

function snapshotPasses(row: Record<string, unknown>): boolean {
  return row.rolcanlogin === true
    && row.rolsuper === false
    && row.rolcreatedb === false
    && row.rolcreaterole === false
    && row.rolinherit === false
    && row.rolreplication === false
    && row.rolbypassrls === false
    && row.rolconnlimit === 2
    && row.db_connect === true
    && row.db_create === false
    && row.public_usage === true
    && row.public_create === false
    && row.retrieval_execute === true
    && row.ingestion_execute === false
    && row.knowledge_select_count === 0
    && row.knowledge_write_count === 0
    && row.ledger_select === false
    && row.ledger_write === false;
}

async function grantMinimalAuthority(setup: Client): Promise<void> {
  await setup.query(
    `do $$
     begin
       execute pg_catalog.format(
         'grant connect on database %I to ${MANAGED_ADMIN} with grant option',
         pg_catalog.current_database()
       );
     end;
     $$;
     grant usage on schema public to ${MANAGED_ADMIN} with grant option;
     grant execute on function
       public.knowledge_retrieve_evidence_packets(uuid[],text[])
       to ${MANAGED_ADMIN} with grant option;`,
  );
}

async function setDisposablePassword(setup: Client, password: string): Promise<void> {
  const formatted = await setup.query(
    "select pg_catalog.format('alter role birello_knowledge_reader password %L', $1::text) as sql",
    [password],
  );
  await setup.query(String(formatted.rows[0]?.sql));
}

async function denied(client: Client, sql: string): Promise<boolean> {
  try {
    await client.query(sql);
    return false;
  } catch {
    return true;
  }
}

async function main(): Promise<void> {
  const setupUrl = localUrl("BIRELLO_LOCAL_READER_SETUP_URL");
  const managedUrl = localUrl("BIRELLO_LOCAL_READER_MANAGED_ADMIN_URL");
  const limitedUrl = localUrl("BIRELLO_LOCAL_READER_LIMITED_ADMIN_URL");
  const readerUrl = localUrl("BIRELLO_LOCAL_RETRIEVAL_READER_URL");
  const readerPassword = new URL(readerUrl).password;
  if (!readerPassword) throw new Error("Local disposable reader password is required");

  const setup = new Client({ connectionString: setupUrl });
  const managed = new Client({ connectionString: managedUrl });
  const limited = new Client({ connectionString: limitedUrl });
  await setup.connect();
  await managed.connect();
  await limited.connect();

  try {
    const managedAttributes = await managed.query(
      `select rolsuper,rolcreaterole,rolcreatedb,rolbypassrls,rolreplication
         from pg_catalog.pg_roles where rolname=current_user`,
    );
    const managedModelPassed =
      managedAttributes.rows[0]?.rolsuper === false
      && managedAttributes.rows[0]?.rolcreaterole === true
      && managedAttributes.rows[0]?.rolcreatedb === false
      && managedAttributes.rows[0]?.rolbypassrls === false
      && managedAttributes.rows[0]?.rolreplication === false;

    await grantMinimalAuthority(setup);

    await resetReader(setup);
    await runBootstrap(managed);
    const absentSnapshot = await contractSnapshot(setup);
    const roleAbsentBootstrapPassed = snapshotPasses(absentSnapshot);

    await runBootstrap(managed);
    const repeatSnapshot = await contractSnapshot(setup);
    const repeatBootstrapPassed =
      snapshotPasses(repeatSnapshot)
      && JSON.stringify(absentSnapshot) === JSON.stringify(repeatSnapshot);

    await resetReader(setup);
    await setup.query(
      `create role ${READER}
         nologin nosuperuser nocreatedb nocreaterole inherit noreplication
         nobypassrls connection limit 9;
       grant ${READER} to ${MANAGED_ADMIN} with admin option;`,
    );
    await runBootstrap(managed);
    const driftSnapshot = await contractSnapshot(setup);
    const existingSafeRoleNormalizationPassed = snapshotPasses(driftSnapshot);

    await resetReader(setup);
    await setup.query(
      `create role ${READER}
         login nosuperuser nocreatedb nocreaterole noinherit noreplication
         bypassrls connection limit 2`,
    );
    const unsafeRestrictedRoleRejected = await expectBootstrapFailure(
      managed,
      /must already be NOBYPASSRLS/,
    );
    const unsafeGrantNotContinued = !(await setup.query(
      `select pg_catalog.has_function_privilege(
         $1,'public.knowledge_retrieve_evidence_packets(uuid[],text[])','EXECUTE'
       ) as allowed`,
      [READER],
    )).rows[0]?.allowed;

    await resetReader(setup);
    await setup.query(
      `do $$
       begin
         execute pg_catalog.format(
           'grant connect on database %I to ${LIMITED_ADMIN} with grant option',
           pg_catalog.current_database()
         );
       end;
       $$;
       grant usage on schema public to ${LIMITED_ADMIN} with grant option;`,
    );
    const insufficientRelevantAuthorityRejected = await expectBootstrapFailure(
      limited,
      /permission denied for function knowledge_retrieve_evidence_packets/,
    );
    const partialRoleRolledBack = !(await setup.query(
      "select exists(select 1 from pg_catalog.pg_roles where rolname=$1) as present",
      [READER],
    )).rows[0]?.present;

    const unrelatedOwner = await setup.query(
      `select pg_catalog.pg_get_userbyid(c.relowner) as owner
         from pg_catalog.pg_class c
         join pg_catalog.pg_namespace n on n.oid=c.relnamespace
        where n.nspname='public' and c.relname='user_documents'`,
    );
    const unrelatedTableNotOwnedByManaged =
      unrelatedOwner.rows[0]?.owner !== MANAGED_ADMIN;

    await runBootstrap(managed);
    const minimalSnapshot = await contractSnapshot(setup);
    const minimalRequiredGrantAuthorityPassed = snapshotPasses(minimalSnapshot);
    const unrelatedObjectRegressionPassed =
      unrelatedTableNotOwnedByManaged && minimalRequiredGrantAuthorityPassed;

    await setDisposablePassword(setup, readerPassword);
    const reader = new Client({ connectionString: readerUrl });
    await reader.connect();
    try {
      const identity = await reader.query(
        "select current_user as role_name,current_database() as database_name",
      );
      const readerLoginPassed = identity.rows[0]?.role_name === READER;
      const q1Ids = [
        stablePackEntityId("claim:anmeldung-deadline-two-weeks"),
        stablePackEntityId("claim:anmeldung-duty"),
      ];
      await reader.query("begin read only");
      const q1 = await reader.query(
        `select claim_id
           from public.knowledge_retrieve_evidence_packets($1::uuid[],$2::text[])`,
        [q1Ids, ["DE"]],
      );
      await reader.query("commit");
      const returned = new Set(q1.rows.map((row) => String(row.claim_id)));
      const readOnlyRpcProofPassed =
        q1.rows.length === 2 && q1Ids.every((id) => returned.has(id));

      const directKnowledgeSelectDenied =
        await denied(reader, "select * from public.knowledge_claims")
        && await denied(reader, "select * from public.knowledge_claim_evidence_links");
      const knowledgeWritesDenied =
        await denied(reader, "insert into public.knowledge_claims default values")
        && await denied(reader, "update public.knowledge_claims set status='active'")
        && await denied(reader, "delete from public.knowledge_claims");
      const ingestionRpcExecuteDenied = await denied(
        reader,
        "select public.knowledge_ingest_curated_pack('{}'::jsonb)",
      );
      const schemaCreateDenied = await denied(
        reader,
        "create schema reader_bootstrap_forbidden",
      );
      const migrationLedgerReadDenied = await denied(
        reader,
        "select * from supabase_migrations.schema_migrations",
      );

      const rls = await setup.query(
        `select count(*)::int as total,
                count(*) filter (where c.relrowsecurity)::int as enabled
           from pg_catalog.pg_class c
           join pg_catalog.pg_namespace n on n.oid=c.relnamespace
          where n.nspname='public'
            and c.relname in (
              'knowledge_claims','knowledge_jurisdictions',
              'knowledge_territorial_scopes','knowledge_claim_evidence_links',
              'knowledge_source_passages','knowledge_source_versions',
              'knowledge_sources','knowledge_citations',
              'knowledge_source_handling_policies','knowledge_retrieval_metadata'
            )`,
      );
      const rlsStillEnabled =
        rls.rows[0]?.total === 10 && rls.rows[0]?.enabled === 10;
      const readerBypassRlsFalse = minimalSnapshot.rolbypassrls === false;

      const allPassed =
        managedModelPassed
        && roleAbsentBootstrapPassed
        && repeatBootstrapPassed
        && existingSafeRoleNormalizationPassed
        && unsafeRestrictedRoleRejected
        && unsafeGrantNotContinued
        && insufficientRelevantAuthorityRejected
        && partialRoleRolledBack
        && minimalRequiredGrantAuthorityPassed
        && unrelatedObjectRegressionPassed
        && readerLoginPassed
        && readOnlyRpcProofPassed
        && directKnowledgeSelectDenied
        && knowledgeWritesDenied
        && ingestionRpcExecuteDenied
        && schemaCreateDenied
        && migrationLedgerReadDenied
        && rlsStillEnabled
        && readerBypassRlsFalse;

      process.stdout.write(`${JSON.stringify({
        checkId: "PKG-R2-REPAIR",
        allPassed,
        managedAdminSuperuser: managedAttributes.rows[0]?.rolsuper,
        managedAdminCreateRole: managedAttributes.rows[0]?.rolcreaterole,
        managedAdminCreateDb: managedAttributes.rows[0]?.rolcreatedb,
        managedAdminBypassRls: managedAttributes.rows[0]?.rolbypassrls,
        managedAdminReplication: managedAttributes.rows[0]?.rolreplication,
        roleAbsentBootstrapPassed,
        repeatBootstrapPassed,
        existingSafeRoleNormalizationPassed,
        unsafeRestrictedRoleRejected,
        unsafeGrantNotContinued,
        insufficientRelevantAuthorityRejected,
        partialRoleRolledBack,
        unrelatedTableNotOwnedByManaged,
        unrelatedObjectRegressionPassed,
        minimalRequiredGrantAuthorityPassed,
        requiredAuthority: [
          "CONNECT grant option on current database",
          "USAGE grant option on public schema",
          "EXECUTE grant option on retrieval RPC",
          "CREATEROLE and role administration authority",
        ],
        unrelatedObjectOwnershipRequired: false,
        ingestionFunctionOwnershipRequired: false,
        knowledgeTableOwnershipRequired: false,
        readerLoginPassed,
        readerRoleAttributesPassed: snapshotPasses(minimalSnapshot),
        retrievalRpcExecuteAllowed: minimalSnapshot.retrieval_execute,
        ingestionRpcExecuteDenied,
        directKnowledgeSelectDenied,
        knowledgeWritesDenied,
        schemaCreateDenied,
        migrationLedgerReadDenied,
        readOnlyRpcProofPassed,
        rlsStillEnabled,
        readerBypassRlsFalse,
        productionConnectionPerformed: false,
        productionDeploymentPerformed: false,
        productionRoleOrGrantChangePerformed: false,
        productionRetrievalPerformed: false,
        ingestionApplyPerformed: false,
      })}\n`);
      if (!allPassed) process.exitCode = 1;
    } finally {
      await reader.end();
    }
  } finally {
    await limited.end();
    await managed.end();
    await setup.end();
  }
}

void main().catch((error: unknown) => {
  process.stderr.write(`${JSON.stringify({
    checkId: "PKG-R2-REPAIR",
    allPassed: false,
    message: error instanceof Error ? error.message : "Managed bootstrap audit failed",
    productionConnectionPerformed: false,
  })}\n`);
  process.exitCode = 1;
});
