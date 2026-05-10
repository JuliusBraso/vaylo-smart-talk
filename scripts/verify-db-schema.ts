/**
 * Deploy-time schema verification (service role).
 *
 * - Fast, practical checks for required tables/columns/constraints.
 * - Optional pg_catalog checks (RLS, policies, partial index) when exposed in PostgREST.
 * - Must NOT run on every request.
 *
 * Usage:
 *   npm run db:verify
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type Missing = { kind: "table_or_column"; table: string; column?: string; hint?: string };

const REQUIRED_TABLES = [
  "user_progress",
  "user_step_state",
  "user_phrase_state",
  "user_documents",
  "knowledge_steps",
  "document_intelligence_jobs",
  "i18n_translations",
] as const;

const REQUIRED_COLUMNS: Record<string, string[]> = {
  user_progress: ["user_id", "action_id"],
  user_step_state: ["user_id", "step_id", "notes", "updated_at"],
  user_phrase_state: ["user_id", "phrase_id"],
  user_documents: ["user_id", "file_path"],
  knowledge_steps: ["eligibility_criteria", "action_id"],
  document_intelligence_jobs: ["status", "attempt_count", "lease_expires_at", "scheduled_at"],
  i18n_translations: ["locale", "key", "value"],
};

const UNIQUE_COLUMN_SETS: { table: string; columns: [string, string] }[] = [
  { table: "user_step_state", columns: ["user_id", "step_id"] },
  { table: "user_progress", columns: ["user_id", "action_id"] },
  { table: "user_phrase_state", columns: ["user_id", "phrase_id"] },
];

const RLS_TABLES = ["user_progress", "user_step_state", "user_phrase_state", "user_documents"] as const;

type ExpectedPolicy = { name: string; cmd: string };

const POLICY_EXPECTATIONS: Record<string, ExpectedPolicy[]> = {
  user_progress: [
    { name: "Users can insert own user_progress", cmd: "INSERT" },
    { name: "Users can update own user_progress", cmd: "UPDATE" },
  ],
  user_step_state: [
    { name: "user_step_state_insert_own", cmd: "INSERT" },
    { name: "user_step_state_update_own", cmd: "UPDATE" },
  ],
  user_phrase_state: [
    { name: "user_phrase_state_select_own", cmd: "SELECT" },
    { name: "user_phrase_state_insert_own", cmd: "INSERT" },
    { name: "user_phrase_state_update_own", cmd: "UPDATE" },
    { name: "user_phrase_state_delete_own", cmd: "DELETE" },
  ],
};

async function tableExists(admin: SupabaseClient, table: string): Promise<boolean> {
  const { data, error } = await admin
    .schema("information_schema")
    .from("tables")
    .select("table_name")
    .eq("table_schema", "public")
    .eq("table_name", table)
    .limit(1);
  if (error) throw error;
  return (data ?? []).length > 0;
}

async function columnExists(
  admin: SupabaseClient,
  table: string,
  column: string,
): Promise<boolean> {
  const { data, error } = await admin
    .schema("information_schema")
    .from("columns")
    .select("column_name")
    .eq("table_schema", "public")
    .eq("table_name", table)
    .eq("column_name", column)
    .limit(1);
  if (error) throw error;
  return (data ?? []).length > 0;
}

/** True if a UNIQUE constraint exists on exactly this column set (order-independent). */
async function hasUniqueOnColumns(
  admin: SupabaseClient,
  table: string,
  columns: string[],
): Promise<boolean> {
  const { data: constraints, error } = await admin
    .schema("information_schema")
    .from("table_constraints")
    .select("constraint_name")
    .eq("table_schema", "public")
    .eq("table_name", table)
    .eq("constraint_type", "UNIQUE");
  if (error) throw error;

  const expected = [...columns].sort().join(",");

  for (const row of constraints ?? []) {
    const cname = (row as { constraint_name: string }).constraint_name;
    const { data: ku, error: e2 } = await admin
      .schema("information_schema")
      .from("key_column_usage")
      .select("column_name")
      .eq("table_schema", "public")
      .eq("table_name", table)
      .eq("constraint_name", cname);
    if (e2) throw e2;
    const colList = (ku ?? [])
      .map((k) => (k as { column_name: string }).column_name)
      .sort()
      .join(",");
    if (colList === expected) return true;
  }
  return false;
}

async function getPublicNamespaceOid(admin: SupabaseClient): Promise<string | null> {
  const { data, error } = await admin
    .schema("pg_catalog")
    .from("pg_namespace")
    .select("oid")
    .eq("nspname", "public")
    .maybeSingle();
  if (error || !data) return null;
  const oid = (data as { oid: number | string }).oid;
  return oid == null ? null : String(oid);
}

async function tryRlsEnabled(
  admin: SupabaseClient,
  publicOid: string,
  table: string,
): Promise<boolean | null> {
  try {
    const { data, error } = await admin
      .schema("pg_catalog")
      .from("pg_class")
      .select("relrowsecurity")
      .eq("relnamespace", publicOid)
      .eq("relname", table)
      .eq("relkind", "r")
      .maybeSingle();
    if (error) return null;
    if (!data) return null;
    const r = (data as { relrowsecurity: boolean }).relrowsecurity;
    return Boolean(r);
  } catch {
    return null;
  }
}

async function loadPoliciesForTable(
  admin: SupabaseClient,
  table: string,
): Promise<Map<string, string> | null> {
  try {
    const { data, error } = await admin
      .schema("pg_catalog")
      .from("pg_policies")
      .select("policyname,cmd")
      .eq("schemaname", "public")
      .eq("tablename", table);
    if (error) return null;
    const m = new Map<string, string>();
    for (const row of data ?? []) {
      const r = row as { policyname: string; cmd: string };
      if (r.policyname && r.cmd) m.set(r.policyname, String(r.cmd).toUpperCase());
    }
    return m;
  } catch {
    return null;
  }
}

async function tryKnowledgeStepsActionIdIndex(admin: SupabaseClient): Promise<boolean | null> {
  try {
    const { data, error } = await admin
      .schema("pg_catalog")
      .from("pg_indexes")
      .select("indexname, indexdef")
      .eq("schemaname", "public")
      .eq("tablename", "knowledge_steps")
      .eq("indexname", "idx_knowledge_steps_action_id")
      .maybeSingle();
    if (error) return null;
    if (!data) return false;
    const def = String((data as { indexdef: string }).indexdef).toLowerCase();
    if (!def.includes("is_active")) return false;
    return true;
  } catch {
    return null;
  }
}

async function tryUniqueKnowledgeStepsActionIdActiveIndex(admin: SupabaseClient): Promise<boolean | null> {
  try {
    const { data, error } = await admin
      .schema("pg_catalog")
      .from("pg_indexes")
      .select("indexname, indexdef")
      .eq("schemaname", "public")
      .eq("tablename", "knowledge_steps")
      .eq("indexname", "uq_knowledge_steps_action_id_active")
      .maybeSingle();
    if (error) return null;
    if (!data) return false;
    const row = data as { indexname: string; indexdef: string };
    const name = String(row.indexname).toLowerCase();
    if (!name.includes("uq_knowledge_steps_action_id_active")) return false;
    const def = String(row.indexdef).toLowerCase();
    if (!def.includes("unique")) return false;
    if (!def.includes("knowledge_steps")) return false;
    if (!def.includes("action_id")) return false;
    if (!def.includes("is_active")) return false;
    if (!def.includes("action_id is not null")) return false;
    return true;
  } catch {
    return null;
  }
}

function logFail(msg: string) {
  // eslint-disable-next-line no-console
  console.error(`[db:verify] FAIL: ${msg}`);
}

function logWarn(msg: string) {
  // eslint-disable-next-line no-console
  console.warn(`[db:verify] WARN: ${msg}`);
}

async function main() {
  const admin = createServiceRoleClient();
  if (!admin) {
    // eslint-disable-next-line no-console
    console.error(
      "[db:verify] FAIL: Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL. Verification requires service role.",
    );
    process.exitCode = 2;
    return;
  }

  const missing: Missing[] = [];
  let failCount = 0;
  let warnCount = 0;

  for (const t of REQUIRED_TABLES) {
    const ok = await tableExists(admin, t);
    if (!ok) {
      missing.push({
        kind: "table_or_column",
        table: t,
        hint: "Run supabase migrations before deploying app code",
      });
    }
  }

  for (const [table, cols] of Object.entries(REQUIRED_COLUMNS)) {
    if (!(await tableExists(admin, table))) continue;
    for (const col of cols) {
      const ok = await columnExists(admin, table, col);
      if (!ok) {
        missing.push({
          kind: "table_or_column",
          table,
          column: col,
          hint: "Likely missing a newer migration",
        });
      }
    }
  }

  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error("\n[db:verify] FAIL: Missing required schema\n");
    for (const m of missing) {
      if (m.column) {
        logFail(`missing column: public.${m.table}.${m.column}${m.hint ? ` (${m.hint})` : ""}`);
      } else {
        logFail(`missing table: public.${m.table}${m.hint ? ` (${m.hint})` : ""}`);
      }
    }
    // eslint-disable-next-line no-console
    console.error("\n[db:verify] STOP: apply migrations, then re-run verification.\n");
    process.exitCode = 1;
    return;
  }

  for (const { table, columns } of UNIQUE_COLUMN_SETS) {
    if (!(await tableExists(admin, table))) continue;
    const ok = await hasUniqueOnColumns(admin, table, columns);
    if (!ok) {
      logFail(
        `missing UNIQUE on public.${table} (${columns.join(", ")}); expected e.g. migration 016 / 026 / 029`,
      );
      failCount += 1;
    }
  }

  const publicOid = await getPublicNamespaceOid(admin);
  if (!publicOid) {
    logWarn(
      "pg_catalog not available via PostgREST (or query failed). Skipping RLS, policy, and partial-index verification — confirm in SQL or expose pg_catalog for stricter checks.",
    );
    warnCount += 1;
  } else {
    const indexOk = await tryKnowledgeStepsActionIdIndex(admin);
    if (indexOk === null) {
      logWarn(
        "Could not read pg_indexes (pg_catalog). Skipping idx_knowledge_steps_action_id check — confirm migration 028.",
      );
      warnCount += 1;
    } else if (indexOk === false) {
      logFail(
        "partial index idx_knowledge_steps_action_id missing or wrong on public.knowledge_steps (migration 028)",
      );
      failCount += 1;
    }

    const uniqueActiveOk = await tryUniqueKnowledgeStepsActionIdActiveIndex(admin);
    if (uniqueActiveOk === null) {
      logWarn(
        "Could not read pg_indexes (pg_catalog). Skipping uq_knowledge_steps_action_id_active check — confirm migration 031.",
      );
      warnCount += 1;
    } else if (uniqueActiveOk === false) {
      logFail("Missing unique active knowledge_steps(action_id) index: uq_knowledge_steps_action_id_active");
      failCount += 1;
    }

    for (const table of RLS_TABLES) {
      const rls = await tryRlsEnabled(admin, publicOid, table);
      if (rls === null) {
        logWarn(`Could not read RLS flag for public.${table} via pg_catalog.`);
        warnCount += 1;
      } else if (rls === false) {
        logFail(`row level security is not enabled on public.${table}`);
        failCount += 1;
      }
    }

    for (const [table, expected] of Object.entries(POLICY_EXPECTATIONS)) {
      const pmap = await loadPoliciesForTable(admin, table);
      if (!pmap) {
        logWarn(`Could not read policies for public.${table} via pg_catalog.`);
        warnCount += 1;
        continue;
      }
      for (const { name, cmd } of expected) {
        const got = pmap.get(name);
        const want = cmd.toUpperCase();
        if (got !== want) {
          logFail(
            `missing or wrong RLS policy on public.${table}: expected "${name}" cmd ${want}, got ${got ?? "none"}`,
          );
          failCount += 1;
        }
      }
    }
  }

  if (failCount > 0) {
    // eslint-disable-next-line no-console
    console.error(`\n[db:verify] RESULT: FAIL (${failCount} issue(s); ${warnCount} warning(s))\n`);
    process.exitCode = 1;
    return;
  }

  if (warnCount > 0) {
    // eslint-disable-next-line no-console
    console.log(`[db:verify] PASS (${warnCount} warning(s) — review above)`);
    return;
  }

  // eslint-disable-next-line no-console
  console.log("[db:verify] PASS");
}

main().catch((err) => {
  logFail(String(err instanceof Error ? err.message : err));
  process.exitCode = 1;
});
