# Production runbook (Vaylo)

Single reference for predictable deploys. **Do not put real secrets in git**—use your platform’s env UI and `.env.example` as the variable list only.

## Hard rules

| Rule | Why |
|------|-----|
| **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client** | It bypasses RLS; treat like a root password. Server-only env, never `NEXT_PUBLIC_*`. |
| **`CRON_SECRET` must be a long random string** | Protects document-intelligence worker HTTP endpoints; short or default values are trivially brute-forced. |
| **Debug flags must be disabled in production** | See *Dangerous flags* below—extra surfaces, verbose errors, or internal APIs. |
| **Apply migrations through the latest numbered file in `supabase/migrations/` before deploying app code that needs them** | Avoid runtime failures and partial schema. |
| **After migration, run DB verification and smoke tests** | `db:verify` catches missing tables/columns; smoke tests catch auth, storage, and jobs. |

## Deployment checklist

- [ ] Staging: migrations applied through latest numbered migration.
- [ ] Staging: `npm run db:verify` passes (with `SUPABASE_SERVICE_ROLE_KEY` + URL for that environment).
- [ ] Staging: smoke tests pass (below).
- [ ] Production: same migration version as the release branch expects.
- [ ] Production: `npm run db:verify` passes.
- [ ] Production: all required env vars set (compare `.env.example`).
- [ ] Production: deploy app **after** DB is verified.
- [ ] Production: smoke tests pass.

## Migration checklist

- [ ] No manual SQL in Supabase UI unless immediately captured as a new migration in git.
- [ ] Do **not** edit already-applied migration files—add a new numbered migration.
- [ ] Apply migrations in order up to the highest `NNN_*.sql` in `supabase/migrations/`.
- [ ] Run `npm run db:verify` against the target project.
- [ ] Only then deploy application code that depends on the new schema.

More detail: [MIGRATIONS.md](./MIGRATIONS.md).

## Production schema preflight (maintenance only)

Run this manually before planning a production migration. It is an adjacent
maintenance utility, not an application runtime, migration, or public-launch
path.

1. Open the Supabase control plane and confirm the correct production project.
2. Verify the project's backup/recovery status and recovery procedure.
3. Configure these values only in the operator's server-side maintenance
   environment:
   - `VAYLO_PRODUCTION_MAINTENANCE_ENABLED=true`
   - `VAYLO_PRODUCTION_MAINTENANCE_TARGET=production`
   - `VAYLO_PRODUCTION_BACKUP_CONFIRMED=true`
   - `VAYLO_PRODUCTION_READONLY_DATABASE_URL=<dedicated read-only PostgreSQL URL>`
4. Run `npm run db:production:preflight`.
5. Review the sanitized ordinary SaaS preflight report, including the remote
   migration ledger, knowledge-table inventory, RLS, grants, and `pgcrypto`.
   The report also exposes the `vaylo_audit` interface when present.
   Interpret its status as follows:
   - `PASS`: no preflight action remains before the next operational stage.
   - `NEEDS_MIGRATION`: review every pending migration; do not auto-apply it.
   - `MISMATCH`: live catalog or security state contradicts expected state.
   - `FAILED`: the preflight could not complete.
   Before first activation, a reachable clean database has no initialized
   Supabase migration ledger and should report `NEEDS_MIGRATION`. After the
   controlled migration deployment, rerun the preflight; `PASS` is available
   only when the required migration and schema conditions are satisfied.
   The separately bootstrapped `vaylo_audit` interface is an optional
   high-assurance diagnostic capability: its absence or incompleteness remains
   visible in the report but does not block ordinary SaaS preflight `PASS`.
   Validate or bootstrap that interface only when its stricter diagnostic
   contract is deliberately required; it is not part of ordinary activation.
6. Review the exact pending migration files. The data expansion at
   `supabase/deferred-migrations/20260423_branching_real_world_expansion.sql`
   is intentionally outside the automatic first-activation chain and does not
   block preflight `PASS`. It requires separate product/data review before any
   manual execution and is not canonical German knowledge ingestion.
7. Only in a separately approved migration phase use the official Supabase
   migration workflow.
8. Run post-migration verification after any later migration.

`VAYLO_PRODUCTION_BACKUP_CONFIRMED=true` is an operator acknowledgement for
that maintenance session. It does not independently prove backup state and
does not authorize writes, migrations, runtime, or launch.

The PostgreSQL URL must belong to a dedicated production inspection identity
with no `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `ALTER`, `DROP`, `TRUNCATE`,
role-management, migration, or Supabase-management authority. The preflight
uses one TLS-verified connection, `BEGIN READ ONLY`, a fixed 10-second
statement timeout, a fixed 1-second lock timeout, source-owned catalog queries,
and no automatic retry. Never use `SUPABASE_SERVICE_ROLE_KEY` as a fallback
and never place the read-only URL in a `NEXT_PUBLIC_*` variable.
The URL must not contain SSL/TLS-control query parameters (including
`sslmode`, `sslcert`, `sslkey`, or `sslrootcert`): the maintenance utility
owns TLS configuration and always requires certificate verification. Unsafe
TLS parameters are rejected rather than silently removed.

## Curated knowledge ingestion (operator maintenance only)

`local-disposable-adapter.ts` remains local-only and must never receive
production credentials. The production path is the fixed, source-owned
`knowledge_ingest_curated_pack(jsonb)` RPC introduced by migration 037.

1. Confirm the ordinary production preflight is `PASS` and verify the committed
   pack checkpoint.
2. Deploy migration 037 through the separately authorized migration workflow.
3. An operator reviews and applies
   `supabase/bootstrap/002_create_birello_knowledge_ingestor.sql`, then assigns
   its password outside Git. The caller receives `EXECUTE` on the RPC and
   read-only migration-ledger access, but no knowledge-table DML or RLS bypass.
4. Configure the operator-only server environment:
   `BIRELLO_PRODUCTION_KNOWLEDGE_INGESTION_ENABLED=true`,
   `BIRELLO_PRODUCTION_KNOWLEDGE_INGESTION_TARGET=production`,
   `BIRELLO_PRODUCTION_KNOWLEDGE_DATABASE_URL`,
   `BIRELLO_PRODUCTION_KNOWLEDGE_DATABASE_NAME`, and
   `BIRELLO_PRODUCTION_KNOWLEDGE_WRITER=birello_knowledge_ingestor`.
5. Run `npm run knowledge:production:ingest -- --mode=validate`.
6. Run `npm run knowledge:production:ingest -- --mode=dry-run` and review the
   sanitized report.
7. After explicit operator authorization, run
   `npm run knowledge:production:ingest -- --mode=apply`.
8. Perform read-only row-count, evidence, and retrieval verification.

The command loads only the committed allowlisted pack. It accepts no pack path,
stdin payload, uploaded data, remote URL, SQL, or browser/runtime request.

## Curated knowledge retrieval (server-only)

Migration 038 provides the fixed
`knowledge_retrieve_evidence_packets(uuid[], text[])` retrieval boundary.
It is separate from the catalog-only `birello_preflight_reader` and the
write-only `birello_knowledge_ingestor`.

1. Deploy migration 038 through the separately authorized migration workflow.
2. An operator reviews and applies
   `supabase/bootstrap/003_create_birello_knowledge_reader.sql`, then assigns
   its password outside Git.
3. Store that credential only in the server-side Smart Talk environment. It
   must never be used in a browser, a `NEXT_PUBLIC_*` value, or an admin,
   ingestion, or preflight job.
4. Before wiring runtime retrieval, perform the separately approved
   production retrieval proof using only the reader identity.

The reader has `EXECUTE` only on this bounded RPC. It has no direct
`knowledge_*` table access, no ingestion-RPC access, no migration-ledger
access, and no write or schema-creation authority.

## Supabase checklist

- [ ] **Auth:** Production redirect URLs and site URL match your deployed domain.
- [ ] **RLS:** Core tables use RLS as defined in migrations (e.g. `user_documents`, `user_progress`, `user_step_state`, `user_phrase_state`, `user_action_events`).
- [ ] **RPCs:** Security-definer functions (e.g. document intelligence enqueue) are updated by migrations—do not drift from repo SQL.
- [ ] **Secrets:** `anon` + `service_role` keys come from the Supabase project dashboard; only anon + URL are `NEXT_PUBLIC_*`.

## Storage checklist

- [ ] Documents bucket is **private** (`public: false`), not world-readable.
- [ ] Policies require object path first segment to match `auth.uid()` (see migrations—`documents` bucket).
- [ ] Application uses signed URLs for downloads, not permanent public links.

## Cron / worker checklist

- [ ] `CRON_SECRET` is set in the server environment.
- [ ] Cron or scheduler calls the document-intelligence worker route with header `x-cron-secret: <CRON_SECRET>` (see app route under `app/api/internal/document-intelligence/worker/`).
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is available **only** to server runtime that runs workers / enqueue—not to the browser.

## Security checklist

- [ ] No `NEXT_PUBLIC_*` variable holds the service role key.
- [ ] Internal debug routes (e.g. step-state debug) return 404 unless explicitly enabled **and** `VAYLO_INTERNAL_DEBUG_SECRET` is set—prefer **off** in prod.
- [ ] Production API errors: generic client messages; no stack traces or raw DB internals to end users (use existing safe error helpers).
- [ ] OpenAI keys only on server; never in client bundles.

## Dangerous flags that must stay off in production

Unless you have a **documented, time-bounded** reason and accept the risk:

| Variable | Risk if enabled |
|----------|-----------------|
| `I18N_STEP_STATE_DEBUG=1` / `VAYLO_STEP_STATE_DEBUG=1` | Can expose internal step-state API when combined with `VAYLO_INTERNAL_DEBUG_SECRET`. |
| `NEXT_PUBLIC_VAYLO_DEBUG=1` | Extra client-visible logging / behavior. |
| `NEXT_PUBLIC_I18N_LOG_MISSING=1` | Noisy diagnostics; avoid in prod unless debugging i18n. |
| `NEXT_PUBLIC_ASSISTANT_DEBUG=1` | Assistant debug surface in client. |

**Production defaults:** use `0` or omit; leave `VAYLO_INTERNAL_DEBUG_SECRET` empty unless you truly need internal debug with a **strong** random secret.

## Required smoke tests after deploy

Run against **the same environment** you just migrated/deployed:

1. **Auth:** Sign in; confirm session persists across a hard refresh on a protected page.
2. **Dashboard:** Load dashboard; actions/data render without console auth errors.
3. **Documents:** List documents; upload a small test file; confirm row appears; open detail if applicable.
4. **Favorites / progress (if applicable):** Toggle favorite; mark an action complete—no 401/500.
5. **Worker (staging or controlled prod test):** Trigger worker with valid `x-cron-secret`; confirm jobs can progress or endpoint returns authorized success shape (no secret in logs).
6. **i18n:** Hit locale/dict path used by the app; confirm 200 and no leaked stack traces on failure.

## Reference

- **Env variable names and grouping:** root `.env.example`
- **Migration order and no-drift policy:** [MIGRATIONS.md](./MIGRATIONS.md)
