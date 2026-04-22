/**
 * Deploy-time schema verification (service role).
 *
 * - Fast, practical checks for required tables/columns.
 * - Must NOT run on every request.
 *
 * Usage:
 *   npm run db:verify
 */
import assert from "node:assert/strict";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type Missing = { kind: "table" | "column"; table: string; column?: string; hint?: string };

const REQUIRED_TABLES = [
  "user_step_state",
  "knowledge_steps",
  "document_intelligence_jobs",
  "i18n_translations",
] as const;

const REQUIRED_COLUMNS: Record<string, string[]> = {
  knowledge_steps: ["eligibility_criteria"],
  user_step_state: ["notes", "updated_at"],
  document_intelligence_jobs: ["status", "attempt_count", "lease_expires_at", "scheduled_at"],
  i18n_translations: ["locale", "key", "value"],
};

async function tableExists(admin: ReturnType<typeof createServiceRoleClient>, table: string): Promise<boolean> {
  assert(admin);
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
  admin: ReturnType<typeof createServiceRoleClient>,
  table: string,
  column: string,
): Promise<boolean> {
  assert(admin);
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

function printMissing(missing: Missing[]) {
  // eslint-disable-next-line no-console
  console.error("\n[db:verify] Missing required schema\n");
  for (const m of missing) {
    if (m.kind === "table") {
      // eslint-disable-next-line no-console
      console.error(`- missing table: public.${m.table}${m.hint ? ` (${m.hint})` : ""}`);
    } else {
      // eslint-disable-next-line no-console
      console.error(`- missing column: public.${m.table}.${m.column}${m.hint ? ` (${m.hint})` : ""}`);
    }
  }
  // eslint-disable-next-line no-console
  console.error("\n[db:verify] STOP: apply migrations, then re-run verification.\n");
}

async function main() {
  const admin = createServiceRoleClient();
  if (!admin) {
    // eslint-disable-next-line no-console
    console.error(
      "[db:verify] Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL. Verification requires service role.",
    );
    process.exitCode = 2;
    return;
  }

  const missing: Missing[] = [];

  for (const t of REQUIRED_TABLES) {
    const ok = await tableExists(admin, t);
    if (!ok) {
      missing.push({
        kind: "table",
        table: t,
        hint: "Run supabase migrations before deploying app code",
      });
    }
  }

  for (const [table, cols] of Object.entries(REQUIRED_COLUMNS)) {
    // Only check columns if table exists (clearer output).
    if (!(await tableExists(admin, table))) continue;
    for (const col of cols) {
      const ok = await columnExists(admin, table, col);
      if (!ok) {
        missing.push({
          kind: "column",
          table,
          column: col,
          hint: "Likely missing a newer migration",
        });
      }
    }
  }

  if (missing.length > 0) {
    printMissing(missing);
    process.exitCode = 1;
    return;
  }

  // eslint-disable-next-line no-console
  console.log("[db:verify] OK: required schema present");
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[db:verify] ERROR", err);
  process.exitCode = 1;
});

